import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { AuthContext } from "../../components/Authv1/AuthContext";
import { axiosInstance, endPoint } from "../../endPoint/api";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import { LiaUserCircleSolid } from "react-icons/lia";
import "./Answer.css";
import FooterComp from "../../components/Footer/FooterComp";

const Answer = () => {
  const { questionId } = useParams();
  console.log(questionId);

  const { state } = useContext(AuthContext);
  const [fetchedAnswer, setFetchedAnswer] = useState([]);
  const [question, setQuestion] = useState({});
  const [answerText, setAnswerText] = useState("");
  const navigate = useNavigate();

  const getAnswers = async () => {
    const token = Cookies.get("token");

    try {
      const response = await axiosInstance.get(
        `${endPoint.QUESTIONS}/${questionId}/answers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFetchedAnswer(response.data.answers);
    } catch (error) {
      console.log("Error fetching answers:", error);
      setFetchedAnswer([]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");
      console.log(token, "token");

      if (token) {
        try {
          const response = await axiosInstance.get(
            `${endPoint.QUESTIONS}/${questionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setQuestion(response?.data?.question);
          console.log(response.data.question);
        } catch (error) {
          console.log("Error fetching question:", error);
        }
      }
    };

    fetchData();
    getAnswers();
  }, [questionId]);

  const postAnswer = async () => {
    const token = Cookies.get("token");

    try {
      await axiosInstance.post(
        `${endPoint.QUESTIONS}/${questionId}/answers`,
        {
          answer: answerText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnswerText("");
      navigate("/home");
    } catch (error) {
      console.log("Error posting answer:", error);
    }
  };

  const handleAnswer = async (e) => {
    e.preventDefault();
    await postAnswer();
  };

  return (
    <section>
      <div className="mb-7 custom-div">
        <Header />
        <h3>Question</h3>

        <h5>{question?.question}</h5>
        <p>{question?.questionDescription}</p>
        <hr />
        <h3>Answers from the Commmunity</h3>
        <hr />

        <>
          <div className="user">
            <LiaUserCircleSolid />
          </div>
          <p>{question?.firstname}</p>
          <ul>
            {fetchedAnswer.map((item) => (
              <li key={item.id}>
                <b>
                  <div className="user">
                    <LiaUserCircleSolid />
                  </div>
                  {item.firstname}:
                </b>
                <br />
                <p>{item.answer}</p>
              </li>
            ))}
          </ul>
        </>

        <form onSubmit={handleAnswer}>
          <div className="mb-3">
            <textarea
              name=""
              style={{ height: "200px" }}
              placeholder="Your Answer..."
              className="form-control"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Post Your Answer
          </button>
        </form>
      </div>
      <FooterComp />
    </section>
  );
};

export default Answer;
