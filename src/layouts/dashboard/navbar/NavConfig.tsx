// utils
import getIcon from '../../../utils/getIcon';

// ----------------------------------------------------------------------

const ICONS = {
  myAccount: getIcon('ic_card'),
  dashboard: getIcon('ic_dashboard'),
  products: getIcon('ic_settings'),
  mainSettings: getIcon('ic_settings'),
  notifications: getIcon('ic_alert_light'),
  myProfile: getIcon('ic_user'),
  changePassword: getIcon('ic_guard')
};

const NavConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: '',
    items: [
      { title: 'My accounts', path: '/app/my-account', icon: ICONS.myAccount },
      { title: 'Dashboard', path: '', icon: ICONS.dashboard },
      { title: 'Products', path: '/app/products', icon: ICONS.products }
    ]
  },
  // SETTINGS
  // ----------------------------------------------------------------------
  {
    subheader: 'Settings',
    items: [
      {
        title: 'Settings',
        path: '/app/settings',
        icon: ICONS.mainSettings,
        children: [
          { title: 'My Profile', path: '/app/settings/my-profile', icon: ICONS.myProfile },
          { title: 'Notifications', path: '', icon: ICONS.notifications },
          {
            title: 'Change Password ',
            path: '/app/settings/change-Password',
            icon: ICONS.changePassword
          }
        ]
      }
    ]
  }
];

export default NavConfig;
