    'use strict';

module.exports = async ({ strapi }) => {
  // Set public permissions for menu items and categories
  const publicRole = await strapi
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (publicRole) {
    // Grant permissions for menu-categories
    await strapi
      .query('plugin::users-permissions.role')
      .update({
        where: { id: publicRole.id },
        data: {
          permissions: {
            ...publicRole.permissions,
            'api::menu-category.menu-category': {
              controllers: {
                'menu-category': {
                  find: { enabled: true, policy: '' },
                  findOne: { enabled: true, policy: '' },
                },
              },
            },
            'api::menu-item.menu-item': {
              controllers: {
                'menu-item': {
                  find: { enabled: true, policy: '' },
                  findOne: { enabled: true, policy: '' },
                },
              },
            },
          },
        },
      });
  }
}; 