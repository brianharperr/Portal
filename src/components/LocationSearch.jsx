import { Divider, Select, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPortal } from "../redux/features/portal.slice";
import { axiosWithCredentials } from "../configs/axios";
import {
    PlusCircleTwoTone
  } from '@ant-design/icons';
import NewLocationModal from "./NewLocationModal";

export default function LocationSearch({ value, disabled, onChange }) {
    const [options, setOptions] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [locationModal, setLocationModal] = useState(false);

    const portal = useSelector(getPortal);
    useEffect(() => {
      // Function to fetch data from your server using Axios
      const fetchData = async () => {
        try {
          const response = await axiosWithCredentials.get(
            '/search/location?query=' + searchText + 
            '&portal=' + portal.ID +
            '&size=4'
            );
          setOptions(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      if (searchText !== '') {
        fetchData();
      } else {
        setOptions([]); // Clear options when the search text is empty
      }
    }, [searchText]);

  
    useEffect(() => {
        setSearchText(value);
        if(value){
            var payload = {
                id: value
            }
            axiosWithCredentials.get('/location', { params: payload })
            .then(res => setSearchText(res.data[0].Name || res.data[0].FullAddress))
        }
    }, [value])

    return (
    <>
    <NewLocationModal close={() => setLocationModal(false)} open={locationModal} onResult={(data) => setSearchText(data.Name || data.FullAddress)}/>
      <Select
        disabled={disabled}
        showSearch
        defaultValue={value}
        notFoundContent="No results."
        value={searchText}
        placeholder="Search for an option"
        defaultActiveFirstOption={false}
        suffixIcon={<Tooltip title="New location"><PlusCircleTwoTone onClick={e => setLocationModal(true)}/></Tooltip>}
        filterOption={false}
        onSearch={setSearchText}
        onChange={e => onChange(e)}
        style={{ width: '100%' }}
      >
        {options.map((option) => (
          <Option key={option.value} value={option.ID}>
            <div>
            <b>{option.Name}</b>
            <p>{option.FullAddress}</p>
            </div>
          </Option>
        ))}
      </Select>
      </>
    );
}