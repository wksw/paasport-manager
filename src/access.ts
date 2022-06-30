/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: PAASPORT.AccountInfo } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    searchAccountPermission: hasRole('searchAccountPermission', currentUser?.roles ?? {}),
    getAccountAllPermission: hasRole('getAccountAllPermission', currentUser?.roles ?? {}),
    accountSyncAllPermission: hasRole('accountSyncAllPermission', currentUser?.roles ?? {}),
    messageAllPermission: hasRole('messageAllPermission', currentUser?.roles ?? {}),
    messageTemplateAllPermission: hasRole('messageTemplateAllPermission', currentUser?.roles ?? {}),
    auditAllPermission: hasRole('auditAllPermission', currentUser?.roles ?? {}),
    protocolAllPermission: hasRole('protocolAllPermission', currentUser?.roles ?? {}),
    transportAnalsysisPermission: hasRole('transportAnalsysisPermission', currentUser?.roles ?? {}),
    searchTransportPermission: hasRole('searchTransportPermission', currentUser?.roles ?? {}),
    transportAlterPermission: hasRole('transportAlterPermission', currentUser?.roles ?? {}),
    transportErrorPermission: hasRole('transportErrorPermission', currentUser?.roles ?? {}),
  };
}

function hasRole(role: string, roles: AUTH.MultiRole): boolean {
  if (!roles.data) {
    return false
  }
  for (const v of roles?.data) {
    if (v.name == role || v.name == 'admin') {
      return true
    }
  }
  return false
}