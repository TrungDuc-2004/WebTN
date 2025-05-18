import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar2 from './Navbar2';
import Footer from './Footer';
import './StudentHistoryDetailPage.css'; 
import { toast } from 'react-toastify';
import axios from 'axios';

const StudentHistoryDetailPage = () => {
  const { submissionId } = useParams(); 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:3000/api/results/${submissionId}`);
        if (res.data) {
          setDetails(res.data);
        } else {
          toast.error('Không tìm thấy chi tiết bài làm này.');
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết bài làm:", err);
        toast.error('Lỗi khi tải chi tiết bài làm.');
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) {
      fetchSubmissionDetails();
    }
  }, [submissionId]);

  const getOptionLetter = (index) => String.fromCharCode(65 + index);

  const formatTimeSpent = (seconds) => {
    if (isNaN(seconds) || seconds === null) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} phút ${secs < 10 ? "0" : ""}${secs} giây`;
  };

  if (loading) {
    return (
      <>
        <Navbar2 />
        <div className="history-detail-page-container loading-message">
          <p>Đang tải chi tiết...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!details || !details.examId) {
    return (
      <>
        <Navbar2 />
        <div className="history-detail-page-container error-message">
          <p>Không có dữ liệu chi tiết cho bài làm này.</p>
          <Link to="/history" className="back-to-history-list-btn">‹ Quay lại Lịch sử</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Giải nén dữ liệu trả về theo schema mong muốn
  const { score, timeSpent, answers, examId } = details;
  const { title, code, questions } = examId; // examId đã populate questions

  const totalQuestions = questions.length;
  const correctCount = answers.filter(a => a.isCorrect).length;
  const incorrectCount = totalQuestions - correctCount;

  return (
    <>
      <Navbar2 />
      <div className="history-detail-page-container">
        <div className="history-detail-header">
          <p><strong>Mã bài kiểm tra:</strong> {code}</p>
          <div className="history-summary-stats">
            <span><strong>Tổng số câu:</strong> {totalQuestions}</span>
            <span><strong>Số câu đúng:</strong> <span className="summary-correct">{correctCount}</span></span>
            <span><strong>Số câu sai:</strong> <span className="summary-incorrect">{incorrectCount}</span></span>
            <span><strong>Thời gian làm bài:</strong> {formatTimeSpent(timeSpent)}</span>
            <span><strong>Điểm:</strong> {score}</span>
          </div>
        </div>

        <div className="history-questions-list">
          {questions.map((question, index) => {
            const userAnswer = answers.find(a => a.questionId === question._id);
            const studentChoice = userAnswer?.selectedOption || null;
            const isCorrect = userAnswer?.isCorrect || false;
            const correctAnswerLetter = question.correctAnswer; 

            return (
              <div
                key={question._id}
                className={`history-question-card ${
                  userAnswer
                    ? (isCorrect ? 'user-answered-correct' : 'user-answered-incorrect')
                    : 'user-not-answered'
                }`}
              >
                <div className="history-question-title">
                  Câu {index + 1}: {question.content}
                </div>
                <div className="history-answers-group">
                  {question.options.map((optionText, optIndex) => {
                    const optionLetter = getOptionLetter(optIndex);
                    const isStudentChoice = optionText === studentChoice;
                    const isSystemCorrectAnswer = optionLetter === correctAnswerLetter;

                    let optionClassName = "history-answer-option";

                    if (isStudentChoice) {
                      optionClassName += isCorrect ? " student-chose-correct" : " student-chose-incorrect";
                    } else if (isSystemCorrectAnswer) {
                      optionClassName += " system-is-correct";
                    }

                    return (
                      <div key={optIndex} className={optionClassName}>
                        <span className="history-option-letter">{optionLetter}.</span>
                        <span className="history-option-text">{optionText}</span>
                        {isStudentChoice && isCorrect && <span className="answer-status-badge correct-badge">✔</span>}
                        {isStudentChoice && !isCorrect && <span className="answer-status-badge incorrect-badge">✘</span>}
                      </div>
                    );
                  })}
                </div>
                {!isCorrect && userAnswer && (
                  <p className="system-correct-answer-feedback">Đáp án đúng: {correctAnswerLetter}</p>
                )}
                {!userAnswer && (
                  <p className="not-answered-feedback">Không trả lời. Đáp án đúng: {correctAnswerLetter}.</p>
                )}
              </div>
            );
          })}
        </div>

        <Link to="/history" className="back-to-history-list-btn">‹ Quay lại Lịch sử</Link>
      </div>
      <Footer />
    </>
  );
};

export default StudentHistoryDetailPage;
