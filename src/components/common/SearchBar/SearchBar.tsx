import './SearchBar.scss';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

const SearchBar = ({ value, onChange, placeholder }: Props) => {
  return (
    <input
      className="searchBar input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      type="text"
    />
  );
};

export default SearchBar;
