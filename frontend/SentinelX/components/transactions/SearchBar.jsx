import react, {useState} from 'react';
import { Search } from 'lucide-react';

export default function SearchBar(){
    const [isFocused, setIsFocused] = useState(false);
    return(
        <div    style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: '#081423',
        border: `1px solid ${isFocused ? '#00e5ff' : '#17324D'}`,
        borderRadius: '999px',
        padding: '11px 18px',
        transition: 'all 0.25s ease',
        boxShadow: isFocused
          ? '0 0 10px rgba(0,229,255,0.6), 0 0 26px rgba(0,229,255,0.25), inset 0 0 10px rgba(0,229,255,0.08)'
          : 'none',
      }}><Search size={16}  color="#7EA0C4" />
        <input type="text" 
        placeholder="Search customers, transactions, device IDs..." />
        onFocus ={() => setIsFocused(true)}
        onBlur ={() => seIsFocused(false)}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          outline: 'none',
          flex: 1,
          fontSize: '13px',
        }}
        </div>
    );

}