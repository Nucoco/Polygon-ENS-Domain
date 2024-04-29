import { useContext } from 'react';
import { TopContext } from '../context/TopContext';

export const useTopContext = () => useContext(TopContext);
