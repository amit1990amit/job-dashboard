import './SearchBar.scss';
import { useTranslation } from 'react-i18next';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onChange, placeholder }: Props) => {
  const { t } = useTranslation();
  
  return (
    <input
      className="searchBar input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || t('search.placeholder')}
      type="text"
    />
  );
};

export default SearchBar;
