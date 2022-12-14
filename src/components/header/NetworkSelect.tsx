import React, {useState, useEffect} from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import {useGetFetchQuery } from './../../hooks/useKeyClient';
import { EthereumIcon, GoerliIcon, OptimismIcon, SepoliaIcon } from './../../icons/NetworkIcons';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { usePersistentContext } from './../../hooks/persistentHook'

interface Network {
  name: string,
  color: string,
  description: string,
  icon: () => JSX.Element
}

const NetworkSelectButton = () => {

  const [network, setNetwork] = usePersistentContext('network',  'Ethereum');

  const [selectedNetwork, setSelectedNetwork] = useState<Network>();


  function getChainIdFromNetwork(networkName: string): string {
    if(networkName === 'Ethereum') {
      return '0x1';
    } else if(networkName === 'Optimism') {
      return '0xa';
    } else if(networkName === 'Goerli') {
      return '0x5';
    } else if(networkName === 'Sepolia') {
      return '0xaa36a7';
    } else { 
      return '0x1';
    }
  }

  const changeNetwork = async (event: any, network: any) => {
    let chainId = getChainIdFromNetwork(network.name);
    if (window.ethereum) {
      try {
        await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }]
        });
        }
      catch (error) {
        console.error(error);
      }
  }
}

  const networks: Array<Network> = [
    {
      name: 'Ethereum',
      color: '#008672',
      description: 'Ethereum Mainnet',
      icon: EthereumIcon
    },
    {
      name: 'Goerli',
      color: '#008672',
      description: 'Goerli Test Network',
      icon: GoerliIcon
    },
    {
      name: 'Sepolia',
      color: '#008672',
      description: 'Sepolia',
      icon: SepoliaIcon
    },
    {
      name: 'Optimism',
      color: '#008672',
      description: 'Optimism',
      icon: OptimismIcon
    }
    
  ];

  function getNetwork(name: string):  Network {
    if(name !== null) { 
        let selectedNetwork = networks.find(x=> x.name === name);
        if(selectedNetwork != null) { 
            return selectedNetwork;
        } else { 
          return networks[0];
        }
    }
    return networks[0];
  }


  function getNetworkIcon(network: string): () => JSX.Element  {
    if(networks !== null) { 
        let selectedNetwork = networks.find(x=> x.name === network);
        if(selectedNetwork == null) { 
          return ( ()=> <React.Fragment/>);
        } else if(selectedNetwork.icon == null) { 
          return (()=> <React.Fragment/>);
        }
        else {
        return selectedNetwork.icon;
        }
    }
    return (()=> <React.Fragment/>);
  }
  useEffect(() => {
    console.log('%%%%%%%%%%%% NS %%%%%', network);
    if (network !== undefined) {
      if(typeof(network) =='string') {
        let networkItem = getNetwork(network as string);
        setSelectedNetwork(networkItem);
      }
    }
  }, [network]);

    return (
        <React.Fragment>
        <FormControl sx={{ m: 1, width: 300 }}>
            <Autocomplete
                    id="from-currency-select"
                    autoHighlight
                    options={networks}
                    onChange={changeNetwork}
                    value = {selectedNetwork  as Network || null}
                    getOptionLabel={(option) => option.name}
                    isOptionEqualToValue={(option: Network, value) => option.name === value.name}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Box
                          component={option.icon}
                          sx={{ width: 17, height: 17, mr: '5px', ml: '-2px' }}
                        />
                        <Box
                          sx={{
                            flexGrow: 1
                          }}
                        >
                          {option.name}
                          <br />
                          <Typography variant="caption">{option.description}</Typography>
                        </Box>
                      </li>
                    )}
                    renderInput={(params) => (
                      <div style={{ position: "relative" }}>
                    {params.inputProps.value && (
                      <span
                        style={{
                          position: "absolute",
                          transform: "translateY(50%)",
                          marginLeft: "5px"
                        }}
                      >
                         <Box
                          component={getNetworkIcon(params.inputProps.value as string)}
                          sx={{
                            position: "absolute",
                            transform: "translateY(50%)",
                            ml: 5,
                            mr: 5
                          }}>
                            &nbsp;
                          </Box>
                      </span>
                    )}
                    <TextField
                      {...params}
                      label="Network"
                      variant="outlined"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                        style: { paddingLeft: "20px" } // disable autocomplete and autofill
                      }}
                    />
                  </div>
                    )}
                  sx={{ width: '250px' }}
                  />
      </FormControl>
    </React.Fragment>
    )
}
export default NetworkSelectButton;