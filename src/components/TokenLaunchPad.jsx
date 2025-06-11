import { useState } from 'react';

export function TokenLaunchpad() {
  const [formData, setFormData] = useState({
    Name: '',
    Symbol: '',
    ImageURL: '',
    InitialSupply: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleCreate() {
    console.log("Creating token with:", formData);
    // Add your token creation logic here
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h1>Solana Token Launchpad</h1>
      <input
        className='inputText'
        type='text'
        name='Name'
        placeholder='Name'
        value={formData.Name}
        onChange={handleChange}
      /><br />
      <input
        className='inputText'
        type='text'
        name='Symbol'
        placeholder='Symbol'
        value={formData.Symbol}
        onChange={handleChange}
      /><br />
      <input
        className='inputText'
        type='text'
        name='ImageURL'
        placeholder='Image URL'
        value={formData.ImageURL}
        onChange={handleChange}
      /><br />
      <input
        className='inputText'
        type='text'
        name='InitialSupply'
        placeholder='Initial Supply'
        value={formData.InitialSupply}
        onChange={handleChange}
      /><br />
      <button className='btn' onClick={handleCreate}>Create a token</button>
    </div>
  );
}
