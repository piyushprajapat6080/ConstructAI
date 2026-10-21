/**
 * Enterprise User Profile & Operational Station Metadata Resolver
 * Strictly enforces enterprise designations and operational station IDs.
 * Dynamically adapts avatar initials:
 * - Safety Officer -> 'SO'
 * - QC Engineer -> 'QC'
 * - Project Director -> 'PD'
 */

export const ENTERPRISE_ROLES = {
  SAFETY: {
    role: 'Site Safety Officer',
    displayName: 'HSE Safety Officer',
    stationId: 'HSE-SITE-402',
    roleTitle: 'Site Safety Lead',
    initials: 'SO'
  },
  QC: {
    role: 'QC Structural Engineer',
    displayName: 'Lead QC Structural Engineer',
    stationId: 'QC-IS456-01',
    roleTitle: 'Civil QC Specialist',
    initials: 'QC'
  },
  ADMIN: {
    role: 'Project Admin / Director',
    displayName: 'Project Director',
    stationId: 'DIR-EXEC-001',
    roleTitle: 'Executive Root Admin',
    initials: 'PD'
  }
};

/**
 * Dynamically computes 2-letter avatar initials for industrial roles & stations.
 */
export function getAvatarInitials(user) {
  if (!user) return 'PD';

  const role = (user.role || '').toLowerCase();
  const name = (user.name || '').toLowerCase();
  const roleTitle = (user.role_title || '').toLowerCase();
  const empId = (user.employee_id || '').toUpperCase();

  // 1. Safety Role -> 'SO' (Safety Officer)
  if (
    role.includes('safety') ||
    name.includes('safety') ||
    roleTitle.includes('safety') ||
    empId.includes('HSE')
  ) {
    return 'SO';
  }

  // 2. QC Structural Role -> 'QC' (QC Engineer)
  if (
    role.includes('qc') ||
    name.includes('qc') ||
    roleTitle.includes('qc') ||
    role.includes('struct') ||
    empId.includes('QC')
  ) {
    return 'QC';
  }

  // 3. Admin / Director Role -> 'PD' (Project Director)
  if (
    role.includes('director') ||
    role.includes('admin') ||
    name.includes('director') ||
    roleTitle.includes('director') ||
    roleTitle.includes('admin') ||
    empId.includes('DIR')
  ) {
    return 'PD';
  }

  // Heuristic fallback for any custom operational role
  const rawText = user.name || user.role || 'Operator';
  const cleanText = rawText.replace(/^(Lead|Site|Er\.|Inspector)\s+/i, '').trim();
  const words = cleanText.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return cleanText.slice(0, 2).toUpperCase();
}

/**
 * Returns a strictly enterprise-sanitized profile with guaranteed
 * operational station IDs, designations, and initials.
 */
export function getEnterpriseProfile(user) {
  if (!user) {
    return {
      name: ENTERPRISE_ROLES.ADMIN.displayName,
      employee_id: ENTERPRISE_ROLES.ADMIN.stationId,
      role: ENTERPRISE_ROLES.ADMIN.role,
      role_title: ENTERPRISE_ROLES.ADMIN.roleTitle,
      initials: ENTERPRISE_ROLES.ADMIN.initials
    };
  }

  const role = user.role || 'Project Admin / Director';
  let defaults = ENTERPRISE_ROLES.ADMIN;

  if (role === 'Site Safety Officer' || (user.name && user.name.toLowerCase().includes('safety'))) {
    defaults = ENTERPRISE_ROLES.SAFETY;
  } else if (role === 'QC Structural Engineer' || (user.name && user.name.toLowerCase().includes('qc'))) {
    defaults = ENTERPRISE_ROLES.QC;
  }

  let resolvedName = user.name || user.role_title || user.title || defaults.displayName;
  let resolvedStation = user.employee_id || user.station_id || defaults.stationId;
  let resolvedTitle = user.role_title || user.title || defaults.roleTitle;
  let resolvedRole = user.role || defaults.role;

  // Map role if raw code is provided
  if (resolvedRole === 'ADMIN') resolvedRole = ENTERPRISE_ROLES.ADMIN.role;
  else if (resolvedRole === 'SAFETY') resolvedRole = ENTERPRISE_ROLES.SAFETY.role;
  else if (resolvedRole === 'QC') resolvedRole = ENTERPRISE_ROLES.QC.role;

  return {
    name: resolvedName,
    employee_id: resolvedStation,
    role: resolvedRole,
    role_title: resolvedTitle,
    initials: getAvatarInitials({
      ...user,
      name: resolvedName,
      employee_id: resolvedStation,
      role: resolvedRole,
      role_title: resolvedTitle
    })
  };
}
