
const menus = [
  {
    path: 'merchandise',
    data: {
      menu: {
        title: 'Merchandise',
        icon: 'ion-bag',
        selected: true,
        expanded: true,
        order: 0
      }
    },
    children: [
      {
        path: 'categories',
        data: {
          menu: {
            title: 'Categories',
            pathMatch: 'partial'
          }
        }
      },
      {
        path: 'vendors',
        data: {
          menu: {
            title: 'Vendors',
            pathMatch: 'partial'
          }
        }
      },
      {
        path: 'products',
        data: {
          menu: {
            title: 'Products',
            pathMatch: 'partial'
          }
        }
      },
      {
        path: 'orders',
        data: {
          menu: {
            title: 'Orders',
            pathMatch: 'partial'
          }
        }
      }
    ]
  },
  {
    path: 'user-management',
    data: {
      menu: {
        title: 'User Management',
        icon: 'ion-person-stalker',
        selected: false,
        expanded: false,
        order: 1
      }
    }
  }
];


export const PAGES_MENU = [
  {
    path: '',
    children: menus
  }
];
