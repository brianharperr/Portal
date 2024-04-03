import React from 'react';
import { Button, Result } from 'antd';
export default function Missing(){

  return (
  <Result
    status="404"
    title="404"
    subTitle="Sorry, the page you visited does not exist."
    extra={<Button onClick={() => window.location.href = "/"}>Back Home</Button>}
  />
  )
}