function adGroup() {
  const arr = [
    // 0 1 [ODC Devloper]
    {
      name: 'G_SENSE_ODC',
      list: [
        { name: 'Dashboard', children: [] },
        { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' },
            { name: 'Network Design Meeting' },
            { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' },
            { name: 'Data Port Looping Protection Detail' },
            { name: 'Data Port Looping Protection' },
            { name: 'Data Port Looping Protection Approval' },
            {
              name: 'IP Address',
              children: [
                { name: 'IP Address Application' },
                { name: 'IP Address Update' },
                { name: 'IP Address Release' },
                { name: 'IP Address Admin' }
              ]
            }
          ]
        },
        {
          name: 'Network Information',
          children: [
            { name: 'Network Coverage' },
            { name: 'Network Closet' },
            { name: 'Equipment' },
            { name: 'WLAN Equipment' },
            { name: 'Cabling System' },
            { name: 'Password Generation & Retrieval System' },
            { name: 'Check Data Port Status' },
            { name: 'Search End Point Device Location' }
          ]
        },
        {
          name: 'Procurement',
          children: [
            { name: 'Procurement Plan' },
            { name: 'Purchase Order' },
            { name: 'Request Form' },
            { name: 'Contract' },
            { name: 'Package List' },
            { name: 'Funding Transfer' }
          ]
        },
        {
          name: 'Resources Management',
          children: [{ name: 'Resources Application' }]
        },
        {
          name: 'Facility Services',
          children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        },
        {
          name: 'AdministrationTenantUser',
          children: [
            { name: 'AD Group Registration' },
            { name: 'Tenant' },
            { name: "Tenant's Quota" },
            { name: 'User Profile' },
            { name: 'Read-Only Permission' },
            { name: 'Switch to Another User' }
          ]
        },
        {
          name: 'AdministratorSystem',
          children: [
            { name: 'Workflows' },
            { name: 'Email Templates' },
            { name: 'Logging - Email' },
            { name: 'File Management' },
            { name: 'Logging - API' },
            { name: 'Project Profiles' },
            { name: 'Task Scheduler' },
            { name: 'System Messages' },
            { name: 'Platform Profiles' }
          ]
        },
        {
          name: 'PlatformResources',
          children: [{ name: 'VM Provisioning' }, { name: 'Server' }]
        }
      ]
    },
    // 1 2 [SENSE Admin]
    {
      name: 'G_SENSE_ADM',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' },
            { name: 'Network Design Meeting' },
            { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' },
            { name: 'Data Port Looping Protection Detail' },
            { name: 'Data Port Looping Protection' },
            { name: 'Data Port Looping Protection Approval' },
            {
              name: 'IP Address',
              children: [
                { name: 'IP Address Application' },
                { name: 'IP Address Update' },
                { name: 'IP Address Release' },
                { name: 'IP Address Admin' }
              ]
            }
          ]
        },
        {
          name: 'Network Information',
          children: [
            { name: 'Network Coverage' },
            { name: 'Network Closet' },
            { name: 'Equipment' },
            { name: 'WLAN Equipment' },
            { name: 'Cabling System' },
            { name: 'Password Generation & Retrieval System' },
            { name: 'Check Data Port Status' },
            { name: 'Search End Point Device Location' }
          ]
        },
        {
          name: 'Procurement',
          children: [
            { name: 'Procurement Plan' },
            { name: 'Purchase Order' },
            { name: 'Request Form' },
            { name: 'Contract' },
            { name: 'Package List' },
            { name: 'Funding Transfer' }
          ]
        },
        {
          name: 'Resources Management',
          children: [{ name: 'Resources Application' }]
        },
        {
          name: 'Facility Services',
          children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        },
        {
          name: 'AdministrationTenantUser',
          children: [
            { name: 'AD Group Registration' },
            { name: 'Tenant' },
            { name: "Tenant's Quota" },
            { name: 'User Profile' },
            { name: 'Read-Only Permission' },
            { name: 'Switch to Another User' }
          ]
        },
        {
          name: 'AdministratorSystem',
          children: [
            { name: 'Workflows' },
            { name: 'Email Templates' },
            { name: 'Logging - Email' },
            { name: 'File Management' },
            { name: 'Logging - API' },
            { name: 'Project Profiles' },
            { name: 'Task Scheduler' },
            { name: 'System Messages' },
            { name: 'Platform Profiles' }
          ]
        },
        {
          name: 'PlatformResources',
          children: [{ name: 'VM Provisioning' }, { name: 'Server' }]
        }
      ]
    },
    // 2 3 [N5 External Network Support]
    {
      name: 'G_SENSE_EN',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        },
        // {
        //   name: 'Network Information',
        //   children: [
        //     { name: 'Network Coverage' },
        //     { name: 'Equipment' },
        //     { name: 'WLAN Equipment' },
        //     { name: 'Cabling System' },
        //     { name: 'Password Generation & Retrieval System' },
        //     { name: 'Check Data Port Status' },
        //     { name: 'Search End Point Device Location' }
        //   ]
        // },
        {
          name: 'Procurement',
          children: [
            { name: 'Procurement Plan' },
            { name: 'Purchase Order' },
            { name: 'Request Form' },
            { name: 'Contract' },
            { name: 'Funding Transfer' }
          ]
        }
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     // { name: 'AD Group Registration' },
        //     // { name: 'Tenant' },
        //     // { name: "Tenant's Quota" },
        //     // { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // },
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' }
        //     // { name: 'Email Templates' },
        //     // { name: 'Logging - Email' },
        //     // { name: 'File Management' },
        //     // { name: 'Logging - API' },
        //     // { name: 'Project Profiles' },
        //     // { name: 'Task Scheduler' },
        //     // { name: 'System Messages' },
        //     // { name: 'Platform Profiles' }
        //   ]
        // },
        // {
        //   name: 'PlatformResources',
        //   children: [{ name: 'VM Provisioning' }, { name: 'Server' }]
        // }
      ]
    },
    // 3 4 [N4 AP Support]
    {
      name: 'G_SENSE_AP',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        },
        {
          name: 'Network Information',
          children: [
            { name: 'Network Coverage' },
            { name: 'Network Closet' },
            { name: 'Equipment' },
            { name: 'WLAN Equipment' },
            { name: 'Cabling System' },
            { name: 'Password Generation & Retrieval System' },
            { name: 'Check Data Port Status' },
            { name: 'Search End Point Device Location' }
          ]
        }
        // {
        //   name: 'Procurement',
        //   children: [
        //     { name: 'Procurement Plan' },
        //     { name: 'Purchase Order' },
        //     { name: 'Request Form' },
        //     { name: 'Contract' },
        //     { name: 'Funding Transfer' }
        //   ]
        // },
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     // { name: 'AD Group Registration' },
        //     // { name: 'Tenant' },
        //     // { name: "Tenant's Quota" },
        //     // { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // },
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' }
        //     // { name: 'Email Templates' },
        //     // { name: 'Logging - Email' },
        //     // { name: 'File Management' },
        //     // { name: 'Logging - API' },
        //     // { name: 'Project Profiles' },
        //     // { name: 'Task Scheduler' },
        //     // { name: 'System Messages' },
        //     // { name: 'Platform Profiles' }
        //   ]
        // },
        // {
        //   name: 'PlatformResources',
        //   children: [{ name: 'VM Provisioning' }, { name: 'Server' }]
        // }
      ]
    },
    // 4 5 [N3 Request Form Admin, sensesc3]
    {
      name: 'G_SENSE_RF',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' },
            { name: 'Network Design Meeting' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' },
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            {
              name: 'IP Address',
              children: [
                { name: 'IP Address Application' },
                { name: 'IP Address Update' },
                { name: 'IP Address Release' },
                { name: 'IP Address Admin' }
              ]
            }
          ]
        },
        {
          name: 'Resources Management',
          children: [{ name: 'Resources Application' }]
        }
        // {
        //   name: 'Network Information',
        //   children: [
        //     { name: 'Network Coverage' },
        //     { name: 'Equipment' },
        //     { name: 'WLAN Equipment' },
        //     { name: 'Cabling System' },
        //     { name: 'Password Generation & Retrieval System' },
        //     { name: 'Check Data Port Status' },
        //     { name: 'Search End Point Device Location' }
        //   ]
        // },
        // {
        //   name: 'Procurement',
        //   children: [
        //     { name: 'Procurement Plan' },
        //     { name: 'Purchase Order' },
        //     { name: 'Request Form' },
        //     { name: 'Contract' },
        //     { name: 'Funding Transfer' }
        //   ]
        // },
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     // { name: 'AD Group Registration' },
        //     // { name: 'Tenant' },
        //     // { name: "Tenant's Quota" },
        //     // { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // }
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' },
        //     { name: 'Email Templates' },
        //     { name: 'Logging - Email' },
        //     { name: 'File Management' },
        //     { name: 'Logging - API' },
        //     { name: 'Project Profiles' },
        //     { name: 'System Messages' },
        //     { name: 'Platform Profiles' }
        //   ]
        // },
        // {
        //   name: 'PlatformResources',
        //   children: [{ name: 'VM Provisioning' }, { name: 'Server' }]
        // }
      ]
    },
    // 5 6 [N3 Procurement Admin]
    {
      name: 'G_SENSE_PO',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        },
        // {
        //   name: 'Network Information',
        //   children: [
        //     { name: 'Network Coverage' },
        //     { name: 'Equipment' },
        //     { name: 'WLAN Equipment' },
        //     { name: 'Cabling System' },
        //     { name: 'Password Generation & Retrieval System' },
        //     { name: 'Check Data Port Status' },
        //     { name: 'Search End Point Device Location' }
        //   ]
        // },
        {
          name: 'Procurement',
          children: [
            { name: 'Procurement Plan' },
            { name: 'Purchase Order' },
            { name: 'Request Form' },
            { name: 'Contract' },
            { name: 'Package List' },
            { name: 'Funding Transfer' }
          ]
        }
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     { name: 'AD Group Registration' },
        //     { name: 'Tenant' },
        //     { name: "Tenant's Quota" },
        //     { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // },
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' },
        //     { name: 'Email Templates' },
        //     { name: 'Logging - Email' },
        //     { name: 'File Management' },
        //     { name: 'Logging - API' },
        //     { name: 'Project Profiles' },
        //     { name: 'System Messages' },
        //     { name: 'Platform Profiles' }
        //   ]
        // },
        // { name: 'PlatformResources', children: [{ name: 'VM Provisioning' }, { name: 'Server' }] }
      ]
    },
    // 6 7 [N3 DP admin]
    {
      name: 'G_SENSE_DP',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' },
            { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        },
        {
          name: 'Network Information',
          children: [
            { name: 'Network Coverage' },
            { name: 'Network Closet' },
            { name: 'Equipment' },
            { name: 'WLAN Equipment' },
            { name: 'Cabling System' },
            { name: 'Password Generation & Retrieval System' },
            { name: 'Check Data Port Status' },
            { name: 'Search End Point Device Location' }
          ]
        }
        // {
        //   name: 'Procurement',
        //   children: [
        //     { name: 'Procurement Plan' },
        //     { name: 'Purchase Order' },
        //     { name: 'Request Form' },
        //     { name: 'Contract' },
        //     { name: 'Funding Transfer' }
        //   ]
        // },
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     { name: 'AD Group Registration' },
        //     { name: 'Tenant' },
        //     { name: "Tenant's Quota" },
        //     { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // },
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' },
        //     { name: 'Email Templates' },
        //     { name: 'Logging - Email' },
        //     { name: 'File Management' },
        //     { name: 'Logging - API' },
        //     { name: 'Project Profiles' },
        //     { name: 'System Messages' },
        //     { name: 'Platform Profiles' }
        //   ]
        // },
        // { name: 'PlatformResources', children: [{ name: 'VM Provisioning' }, { name: 'Server' }] }
      ]
    },
    // 7 8 [N3 Network Designer]
    {
      name: 'G_SENSE_ND',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' },
            { name: 'Network Design Meeting' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        },
        {
          name: 'Network Information',
          children: [
            { name: 'Network Coverage' },
            { name: 'Network Closet' },
            { name: 'Equipment' },
            { name: 'WLAN Equipment' },
            { name: 'Cabling System' },
            { name: 'Password Generation & Retrieval System' },
            { name: 'Check Data Port Status' },
            { name: 'Search End Point Device Location' }
          ]
        }
        // {
        //   name: 'Procurement',
        //   children: [
        //     { name: 'Procurement Plan' },
        //     { name: 'Purchase Order' },
        //     { name: 'Request Form' },
        //     { name: 'Contract' },
        //     { name: 'Funding Transfer' }
        //   ]
        // },
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     { name: 'AD Group Registration' },
        //     { name: 'Tenant' },
        //     { name: "Tenant's Quota" },
        //     { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // },
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' },
        //     { name: 'Email Templates' },
        //     { name: 'Logging - Email' },
        //     { name: 'File Management' },
        //     { name: 'Logging - API' },
        //     { name: 'Project Profiles' },
        //     { name: 'System Messages' },
        //     { name: 'Platform Profiles' }
        //   ]
        // },
        // { name: 'PlatformResources', children: [{ name: 'VM Provisioning' }, { name: 'Server' }] }
      ]
    },
    // 8 9 [T2 Linux VM Provisioning Support, sensesc2]
    {
      name: 'G_SENSE_VM',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        },
        // {
        //   name: 'Network Information',
        //   children: [
        //     { name: 'Network Coverage' },
        //     { name: 'Equipment' },
        //     { name: 'WLAN Equipment' },
        //     { name: 'Cabling System' },
        //     { name: 'Password Generation & Retrieval System' },
        //     { name: 'Check Data Port Status' },
        //     { name: 'Search End Point Device Location' }
        //   ]
        // },
        // {
        //   name: 'Procurement',
        //   children: [
        //     { name: 'Procurement Plan' },
        //     { name: 'Purchase Order' },
        //     { name: 'Request Form' },
        //     { name: 'Contract' },
        //     { name: 'Funding Transfer' }
        //   ]
        // },
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     { name: 'AD Group Registration' },
        //     { name: 'Tenant' },
        //     { name: "Tenant's Quota" },
        //     { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // },
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' },
        //     { name: 'Email Templates' },
        //     { name: 'Logging - Email' },
        //     { name: 'File Management' },
        //     { name: 'Logging - API' },
        //     { name: 'Project Profiles' },
        //     { name: 'System Messages' },
        //     { name: 'Platform Profiles' }
        //   ]
        // },
        { name: 'PlatformResources', children: [{ name: 'VM Provisioning' }, { name: 'Server' }] }
      ]
    },
    // 9 10 [Requester, sensesc1(Requester)]
    {
      name: 'G_SENSE_UR',
      list: [
        // { name: 'Dashboard', children: [] },
        // { name: 'Search', children: [] },
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        }
        // {
        //   name: 'Network Information',
        //   children: [
        //     { name: 'Network Coverage' },
        //     { name: 'Equipment' },
        //     { name: 'WLAN Equipment' },
        //     { name: 'Cabling System' },
        //     { name: 'Password Generation & Retrieval System' },
        //     { name: 'Check Data Port Status' },
        //     { name: 'Search End Point Device Location' }
        //   ]
        // },
        // {
        //   name: 'Procurement',
        //   children: [
        //     { name: 'Procurement Plan' },
        //     { name: 'Purchase Order' },
        //     { name: 'Request Form' },
        //     { name: 'Contract' },
        //     { name: 'Funding Transfer' }
        //   ]
        // },
        // {
        //   name: 'Facility Services',
        //   children: [{ name: 'GIS' }, { name: 'Institution Profile' }, { name: 'Facility' }]
        // },
        // {
        //   name: 'AdministrationTenantUser',
        //   children: [
        //     { name: 'AD Group Registration' },
        //     { name: 'Tenant' },
        //     { name: "Tenant's Quota" },
        //     { name: 'User Profile' },
        //     { name: 'Read-Only Permission' },
        //     { name: 'Switch to Another User' }
        //   ]
        // },
        // {
        //   name: 'AdministratorSystem',
        //   children: [
        //     { name: 'Workflows' },
        //     { name: 'Email Templates' },
        //     { name: 'Logging - Email' },
        //     { name: 'File Management' },
        //     { name: 'Logging - API' },
        //     { name: 'Project Profiles' },
        //     { name: 'System Messages' },
        //     { name: 'Platform Profiles' }
        //   ]
        // },
        // { name: 'PlatformResources', children: [{ name: 'VM Provisioning' }, { name: 'Server' }] }
      ]
    },
    // 10 11 [Guest Defult]
    {
      name: 'Guest',
      list: [
        { name: 'My Request', children: [{ name: 'Detail' }, { name: 'DetailDE' }] },
        { name: 'My Action', children: [{ name: 'Detail' }] },
        { name: 'My Draft', children: [] },
        {
          name: 'Network Installation',
          children: [
            { name: 'Data Port Installation' },
            { name: 'HA WIFI AP Installation' }
            // { name: 'Feedback Management' }
          ]
        },
        {
          name: 'Network Configuration',
          children: [
            { name: 'Data Port Disabling/Enabling' }
            // { name: 'Data Port Looping Protection Detail' },
            // { name: 'Data Port Looping Protection' },
            // { name: 'Data Port Looping Protection Approval' },
            // {
            //   name: 'IP Address',
            //   children: [
            //     { name: 'IP Address Application' },
            //     { name: 'IP Address Update' },
            //     { name: 'IP Address Release' },
            //     { name: 'IP Address Admin' }
            //   ]
            // }
          ]
        }
      ]
    }
  ];
  return arr;
}

export { adGroup };
