/**
 * @module Db/User_Permissions
 */

/**
 * @description Administrator permission. This permission if for the maintance
 *              of all platform. Gives the access of all areas.
 */
exports.ADMIN = 'A';

/**
 * @description User permission. This permission gives only access for uploading
 *              files, change the user crendentials and share the files for 
 *              public or private access.
 */
exports.USER = 'U';

/**
 * @description Viewer permission. This permission is only who wants to view 
 *              private shared files.
 */
exports.VIEWER = 'U-';