import React, { useState } from 'react';
import { HomePage, LoadingScreen } from '../components';

function Home() {
  const [loading, setLoading] = useState(false);
  function toggleLoadingScreen(){
    setLoading(prev => !prev);
  }

  return (
    <>
      {loading ? <LoadingScreen /> : <HomePage toggleLoading={toggleLoadingScreen}/>}
      
      
    </>
  )
}

export default Home