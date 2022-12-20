import React, { useState, useEffect } from 'react';
import { SearchBar } from '../../../../components';
import API from '../../../../api/webdp/webdp';

export default function Header({ params, setParams, getNetworkCoverages, setIsSearched, setRows }) {
  const [q, setQ] = useState('block');
  const [hospitalMap, setHospitalMap] = useState({});
  const [hospitalOptions, setHospitalOptions] = useState([]);
  const [blockMap, setBlockMap] = useState({});
  const [blockOptions, setBlockOptions] = useState([]);
  const [floorMap, setFloorMap] = useState({});
  const [floorOptions, setFloorOptions] = useState([]);

  const [disableBlock, setDisableBlock] = useState(true);
  const [disableFloor, setDisableFloor] = useState(true);
  const [hospitalRequire, setHospitalRequire] = useState(false);

  useEffect(() => {
    //   Get a list of hospitals
    API.getHospitalList().then((hospitalRes) => {
      const hospitalList = hospitalRes?.data?.data.hospitalList || [];
      const hospitalListData = [];
      const newHospitalMap = {};
      hospitalList.forEach((hospitalItem) => {
        if (hospitalItem.hospitalName && hospitalItem.hospital) {
          hospitalListData.push(hospitalItem);
          newHospitalMap[hospitalItem.hospital] = hospitalItem;
        }
      });
      hospitalListData.sort((a, b) =>
        `${a.hospital}${a.hospitalName}`?.localeCompare(`${b.hospital}${b.hospitalName}`)
      );
      setHospitalMap(newHospitalMap);
      setHospitalOptions(hospitalListData);
    });
  }, []);

  useEffect(() => {
    // Get the street information of a hospital
    if (params?.hospital) {
      API.getBlockByHospCodeList(params?.hospital).then((blockResult) => {
        const block = blockResult?.data?.data?.blockByHospCodeList || [];
        const blockListData = [];
        const newBlockMap = {};
        block.forEach((blockItem) => {
          if (blockItem.block) {
            blockListData.push(blockItem);
            newBlockMap[blockItem.block] = blockItem;
          }
        });
        blockListData.sort((a, b) => `${a.block}`?.localeCompare(`${b.block}`));

        setQ('block');
        setDisableBlock(false);
        setBlockMap(newBlockMap);
        setBlockOptions(blockListData);
      });
    } else {
      setDisableBlock(true);
      setBlockMap([]);
      setBlockOptions([]);

      setDisableFloor(true);
      setFloorMap([]);
      setFloorOptions([]);

      const newParams = {
        ...params,
        block: '',
        floor: ''
      };
      setParams(newParams);
    }
  }, [params?.hospital]);

  useEffect(() => {
    // Get the floor information
    if (params?.block) {
      API.getBlockAndFloorByHospCodeList({
        block: params?.block,
        hospCode: params?.hospital
      }).then((blockResult) => {
        const floor = blockResult?.data?.data?.blockAndFloorByHospCodeList || [];
        const floorListData = [];
        const newFloorMap = {};
        floor.forEach((floorItem) => {
          if (floorItem.floor) {
            floorListData.push(floorItem);
            newFloorMap[floorItem.floor] = floorItem;
          }
        });
        floorListData.sort((a, b) => `${a.floor}`?.localeCompare(`${b.floor}`));
        setQ('floor');
        setDisableFloor(false);
        setFloorMap(newFloorMap);
        setFloorOptions(floorListData);
      });
    } else {
      setQ('block');
      setDisableFloor(true);
      setFloorMap([]);
      setFloorOptions([]);

      const newParams = {
        ...params,
        floor: ''
      };
      setParams(newParams);
    }
  }, [params?.block]);

  useEffect(() => {
    if (params?.floor) {
      setQ('room');
    } else if (!params?.floor) {
      if (params.block) {
        setQ('floor');
      } else {
        setQ('block');
      }
    }
  }, [params?.floor]);

  const searchBarFieldList = [
    {
      id: 'hospital',
      name: 'hospital',
      label: 'Institution',
      type: 'autocomplete',
      options: hospitalOptions,
      error: hospitalRequire,
      getOptionLabel: (option) => `${option.hospital}`,
      value: hospitalMap[params?.hospital] || null
    },
    {
      id: 'block',
      name: 'block',
      label: 'Block',
      type: 'autocomplete',
      options: blockOptions,
      disabled: disableBlock,
      getOptionLabel: (option) => `${option.block}`,
      value: blockMap[params?.block] || null
    },
    {
      id: 'floor',
      name: 'floor',
      label: 'Floor',
      type: 'autocomplete',
      options: floorOptions,
      disabled: disableFloor,
      getOptionLabel: (option) => `${option.floor}`,
      value: floorMap[params?.floor] || null
    }
  ];

  const onSearchFieldChange = (value, id) => {
    const newParams = {
      ...params,
      [id]: value?.target?.value?.[id] || ''
    };
    if (id === 'hospital' && value?.target?.value?.[id]) {
      setHospitalRequire(false);
    }
    setParams(newParams);
  };

  //   Search
  const handleSubmit = () => {
    if (!params.hospital) {
      setHospitalRequire(true);
      return;
    }
    getNetworkCoverages({
      hospital: params.hospital || undefined,
      block: params.block || undefined,
      floor: params.floor || undefined,
      q
    });
  };

  //   Clear
  const handleClear = () => {
    const newParams = {
      ...params,
      pageIndex: 1,
      hospital: '',
      block: '',
      floor: ''
    };
    setQ('block');
    setRows([]);
    setParams(newParams);
    setIsSearched(false);
    setHospitalRequire(false);
  };

  return (
    <>
      <SearchBar
        onSearchFieldChange={onSearchFieldChange}
        onSearchButton={handleSubmit}
        onClearButton={handleClear}
        fieldList={searchBarFieldList}
      />
    </>
  );
}
