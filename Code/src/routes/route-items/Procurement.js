import React from 'react';
import IsoOutlinedIcon from '@material-ui/icons/IsoOutlined';

import RequestForm from '../../pages/Procurement/RequestForm';
import { Detail as RequestFormDetail } from '../../pages/Procurement/RequestForm/components';
import ProcurementPlan from '../../pages/Procurement/ProcurementPlan';
import FundingTransfer from '../../pages/Procurement/FundingTransfer';
import Contract from '../../pages/Procurement/Contract';
import Preparation from '../../pages/rms/Preparation';
import PackageList from '../../pages/Procurement/PackageList';

const Procurement = {
  id: 'Procurement',
  name: 'Procurement',
  path: '/Procurement',
  icon: <IsoOutlinedIcon />,
  component: Preparation,
  children: [
    {
      name: 'Procurement Plan',
      path: '/Procurement/ProcurementPlan',
      component: ProcurementPlan
    },
    {
      name: 'Purchase Order',
      path: '/Procurement/Preparation',
      component: Preparation
    },
    {
      name: 'Request Form',
      path: '/Procurement/RequestForm',
      component: RequestForm
    },
    {
      name: 'Contract',
      path: '/Procurement/Contract',
      component: Contract
    },
    {
      name: 'ContractCreate',
      path: '/Procurement/Contract/create',
      component: Contract
    },
    {
      name: 'ContractDetail',
      path: '/Procurement/Contract/detail/:contractId',
      component: Contract
    },
    {
      name: 'ContractUpdate',
      path: '/Procurement/Contract/update/:contractId',
      component: Contract
    },
    {
      name: 'Package List',
      path: '/Procurement/PackageList',
      component: PackageList
    },
    {
      name: 'Package List Create',
      path: '/Procurement/PackageList/create',
      component: PackageList
    },
    {
      name: 'Package List Detail',
      path: '/Procurement/PackageList/detail/:id',
      component: PackageList
    },
    {
      name: 'Package List Update',
      path: '/Procurement/PackageList/update/:id',
      component: PackageList
    },
    {
      name: 'Funding Transfer',
      path: '/Procurement/FundingTransfer',
      component: FundingTransfer
    },
    {
      name: 'Request Form Detail',
      path: '/Procurement/RequestForm/Detail',
      component: RequestFormDetail,
      isHidden: true
    }
  ]
};

export default Procurement;
