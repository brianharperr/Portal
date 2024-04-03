import { Drawer, Menu } from "antd";
import Logo from '../../assets/logo.png';
import { Link } from 'react-scroll';

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}
export default function NavbarDrawer({ visible, close, openLogin, openRegister })
{

    const items = [
        getItem(<Link to="About" spy={true} smooth={true} duration={200} onClick={close}>About</Link>, '1'),
        getItem(<Link to="Services" spy={true} smooth={true} duration={200} onClick={close}>Services</Link>, '2'),
        getItem(<Link to="Pricing" spy={true} smooth={true} duration={200} onClick={close}>Pricing</Link>, '3'),
        getItem(<Link to="Help" spy={true} smooth={true} duration={200} onClick={close}>Help</Link>, '4'),
        getItem(<Link to="Contact" spy={true} smooth={true} duration={200} onClick={close}>Contact</Link>, '5'),
        {
            type: 'divider',
        },
        getItem('Get Started', 'grp', null, [getItem(<p onClick={openLogin}>Log In</p>, '6'), getItem(<p onClick={openRegister}>Sign Up</p>, '7')], 'group'),
        ];

    return (
        <Drawer size="large" title={<div className="float-right"><img src={Logo}/></div>} placement="left" onClose={close} open={visible}>
        <Menu
        mode="inline"
        items={items}
        />
        </Drawer>
    )
}