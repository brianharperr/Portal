import PageBuilder from "../../components/admin/PageBuilder";
import { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, Spin, message, Divider, Switch, Modal, Checkbox, Popconfirm } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { getSelectedPortal, getTheme, updateColorTheme, updateSubdomain, updateLogo, updateAutomaticRenewal, deletePortal } from "../../redux/features/admin.portal.slice";
import { useSelector, useDispatch } from "react-redux";
import { axiosWithAdminCredentials, axiosWithoutCredentials } from "../../configs/axios";
import { CirclePicker } from 'react-color';

import ColorTheme from "../../configs/color-themes";

export default function Settings() {

  const portal = useSelector(getSelectedPortal);
  const [settings, setSettings] = useState();
  const [modal, contextHolder] = Modal.useModal();
  const [subdomainCheckLoading, setSubdomainCheckLoading] = useState(false);
  const [subdomainAvailability, setSubdomainAvailability] = useState();
  const [image, setImage] = useState();
  const theme = useSelector(getTheme);
  const [autoRenewal, setAutoRenewal] = useState();
  const dispatch = useDispatch();
  const colors = ColorTheme.map(x => x.background.primary);
  const domainStatus = () => subdomainCheckLoading ? 'validating' : subdomainAvailability === undefined ? null : subdomainAvailability ? 'success' : 'error';
  const domainFeedback = () => subdomainCheckLoading ? 'Checking Availability...' : subdomainAvailability === undefined ? null : subdomainAvailability ? 'Available' : 'Not Available'

  function handleThemeChange(color){
      var payload = {
          PortalID: portal.ID,
          ColorTheme: ColorTheme.find(x => x.background.primary === color.hex).ID
      }
      dispatch(updateColorTheme(payload));
  }

  const onImageChange = (event) => {
    if(event.fileList.length === 1 && event.file.size > 2000000)
    {
      message.error('File size exceeds 2 MB.')
    }else{
      setImage(event.fileList);
      let formData = new FormData();
      if(event.fileList.length === 0)
      {
        formData.append("file",null);
      }else{
        formData.append("file", event.fileList[0].originFileObj);
      }
      formData.append("PortalID", portal.ID);
      dispatch(updateLogo(formData));
    }

  }

  function handleDelete()
  {
      dispatch(deletePortal(portal))
  }

  function handleDeleteConfirm()
  {
    modal.confirm({
        title: 'Do you wish to delete this portal?',
        content: 'Once deleted, all data pertaining to this portal will be deleted. Make sure to export any data you need before proceeding. You will not have access to the portal after deletion. You will be prorated the remaining time on your subscription.',
        okText: 'I wish to delete this portal.',
        cancelText: 'Do not delete.',
        onOk: () => handleDelete()
      });
  }
  function handleAutomaticRenewalChange(e)
  {
      var payload = {
          SubscriptionID: settings.SubscriptionID,
          Value: e
      }

      dispatch(updateAutomaticRenewal(payload)).unwrap()
      .then(() => {
        setAutoRenewal(e);  
      })
  }

  function handleDomainChange()
  {
    dispatch(updateSubdomain(payload)).unwrap()
    .then(() => {

    })
    .catch(err => {

    })
    .finally(() => {});
  }


  useEffect(() => {
    if(settings?.Subdomain !== portal?.Subdomain){
        setSubdomainCheckLoading(true);
        const delayDebounceFn = setTimeout(() => {
            axiosWithoutCredentials.get('/portal/namecheck/' + settings.Subdomain)
            .then(res => {
                setSubdomainAvailability(res.data);
            })
            .finally(() => {
                setSubdomainCheckLoading(false);
            })
          }, 1000);
      
          return () => clearTimeout(delayDebounceFn)
    }else{
        setSubdomainCheckLoading(false);
        setSubdomainAvailability(undefined);
    }
  }, [settings?.Subdomain]);

  useEffect(() => {
    if(portal){
        var payload = {
            ID: portal.ID
        }
        axiosWithAdminCredentials.get('/portal/settings', { params: payload})
        .then(res => {
            setSettings(portal);
        })

        var payload2 = {
            id: portal.SubscriptionID
          }
        axiosWithAdminCredentials.get('/stripe/subscription', { params: payload2})
        .then(res => {
          if(res.data){
            setAutoRenewal(res.data.cancel_at_period_end ? false : true)
          }
        })
    }
  }, [portal])
  return (
    <PageBuilder breadcrumb={["Settings"]} name="settings">
        <Spin spinning={!settings} indicator={<LoadingOutlined/>}>
          <Form>
            <Form.Item
            label="Name"
            required
            >
              <Input value={settings?.Name} onChange={e => setSettings({...settings, Name: e.target.value})} maxLength={128} />
              {settings?.Name && settings?.Name !== portal?.Name && <Button className="mt-2" type="primary">Save</Button>}
            </Form.Item>
            <Form.Item
            required
            validateStatus={domainStatus()} hasFeedback help={domainFeedback()}
            label="Domain"
            >
              <Input
              addonBefore="https://"
              addonAfter=".familylynk.com"
              value={settings?.Subdomain} onChange={e => setSettings({...settings, Subdomain: e.target.value})}
              maxLength={45}
              />
              {subdomainAvailability &&<Button className="mt-2" onClick={handleDomainChange}>Save</Button>}
            </Form.Item>
            <Divider/>
            {settings &&
              <Form.Item
              label="Logo"
              >
              <Upload
                  beforeUpload={(file) => {

                    return false;
                  }}
                  accept=".png, .jpg"
                  listType="picture"
                  fileList={image}
                  maxCount={1}
                  onChange={(e) => onImageChange(e)}
                  defaultFileList={settings?.LogoSource ? [
                    {
                      uid: '0',
                      name: 'logo.png',
                      status: 'done',
                      url: settings.LogoSource,
                    }
                  ]: []}
                  >
                      <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
              </Form.Item>
            }
            <Form.Item
            label="Theme"
            >
              <CirclePicker color={theme?.background.primary} colors={colors} onChangeComplete={handleThemeChange}/>
            </Form.Item>
            <Divider/>
            <Form.Item label="Automatic Renewal">
              <Switch checkedChildren="ON" unCheckedChildren="OFF" checked={autoRenewal} onChange={(e) => handleAutomaticRenewalChange(e)}/>
            </Form.Item>
            <Form.Item>
                    {contextHolder}
                    <Button danger onClick={handleDeleteConfirm}>Delete Portal</Button>
            </Form.Item>
          </Form>
        </Spin>
    </PageBuilder>
  );
};