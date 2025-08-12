import Link from 'next/link';
import Image from 'next/image';
import { jsx, H3 } from '@keystone-ui/core';
import logo from './Austrich_circle_cropped.png';

const CustomLogo = () => {
  return (
    <H3>
      <Link
        href="/"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          textDecoration: 'none'
        }}
      >
        <Image src={logo} width="36" height="36"/> Flightless Nerd
      </Link>
    </H3>
  );
};

export default CustomLogo;