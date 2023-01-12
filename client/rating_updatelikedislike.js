  const [likes, setLikes] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [score, setScore] = useState([]);


//update likes and user's score
  const uplikes = async (updlikes, offer_id, us_id) => {
    try {
      const response1 = await fetch(`http://localhost:5000/offerlike?updatedlikes?${updlikes}offerid=${offer_id}`);
      const uplike = await response1.json();
      setLikes(uplike);
      const response2 = await fetch(`http://localhost:5000/offerscore?userid=${us_id}`);
      const upscor = await response2.json();
      setScore(upscor);
    } catch (err) {
      console.error(err.message);
    }
  };


//update dislikes and user's score
  const updislikes = async (upddislikes, offer_id, us_id) => {
    try {
      const response1 = await fetch(`http://localhost:5000/offerdislike?updateddislikes?${upddislikes}offerid=${offer_id}`);
      const updislike = await response1.json();
      setLikes(updislike);
      const response2 = await fetch(`http://localhost:5000/offerscore?userid=${us_id}`);
      const upscor = await response2.json();
      setScore(upscor);
    } catch (err) {
      console.error(err.message);
    }
  };
