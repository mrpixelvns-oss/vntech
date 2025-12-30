
import SimpleLoader from './SimpleLoader';
import CrystalLoader from './CrystalLoader';
import MatrixLoader from '../MatrixLoader';
import SpinLoader from './SpinLoader';
import TextInvertLoader from './TextInvertLoader';
import GrifowOrbitLoader from './GrifowOrbitLoader';

export const LOADERS = {
  'default': { 
    name: 'Simple Spin', 
    component: SimpleLoader,
    description: 'Hiệu ứng xoay đơn giản, tinh tế.'
  },
  'crystal': { 
    name: 'Crystal Hex', 
    component: CrystalLoader,
    description: 'Hiệu ứng tinh thể xoay 3D hiện đại.'
  },
  'matrix': { 
    name: 'Matrix Laptop', 
    component: MatrixLoader,
    description: 'Hiệu ứng máy tính Hacker kiểu Matrix.'
  },
  'spin-dual': { 
    name: 'Dual Spinner', 
    component: SpinLoader,
    description: 'Vòng xoay kép xanh đỏ hiện đại.'
  },
  'text-invert': { 
    name: 'Invert Text', 
    component: TextInvertLoader,
    description: 'Hiệu ứng đảo màu chữ chạy qua lại độc đáo.'
  },
  'grifow-orbit': { 
    name: 'Grifow Orbit', 
    component: GrifowOrbitLoader,
    description: 'Hiệu ứng độc quyền, mang đậm bản sắc thương hiệu.'
  }
};

export type LoaderKey = keyof typeof LOADERS;
