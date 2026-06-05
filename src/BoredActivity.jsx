import React, { useState, useEffect } from 'react';

const BoredActivity = () => {
  const [activity, setActivity] = useState({
    activity: "Loading...",
    type: "",
    participants: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchRandomActivity = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://www.boredapi.com/api/random');
      const data = await response.json();
      setActivity({
        activity: data.activity,
        type: data.type,
        participants: data.participants,
      });
    } catch (err) {
      setActivity({
        activity: "Failed to load activity. Try again.",
        type: "",
        participants: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomActivity();
  }, []);

  return (
    <div>
      <h1>Random Activity</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p><strong>{activity.activity}</strong></p>
          <p>Type: {activity.type}</p>
          <p>Participants: {activity.participants}</p>
          <button onClick={fetchRandomActivity}>Get New Activity</button>
        </>
      )}
    </div>
  );
};

export default BoredActivity;
