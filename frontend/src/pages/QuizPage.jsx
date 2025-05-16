// frontend/src/pages/QuizPage.jsx
import React, { useState, useEffect, useRef } from "react";
import "./QuizPage.css"; // Đảm bảo bạn có file CSS này và import nó
import Navbar2 from "./Navbar2"; // Giả sử Navbar2.jsx nằm cùng cấp trong src/pages
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const QuizPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const exam = state?.exam; // exam object được truyền từ StartPage
  const userId = state?.userId; // userId được truyền từ StartPage

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null); // Index của đáp án được chọn (0-3)
  const [userAnswers, setUserAnswers] = useState([]); // Mảng lưu các câu trả lời của user [{ questionId, selectedOptionValue, isCorrect, scoreAwarded }]
  
  // State mới để theo dõi số câu đúng/sai và tiến độ
  const [answeredQuestionsCount, setAnsweredQuestionsCount] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
  
  const [currentTotalScore, setCurrentTotalScore] = useState(0); // Điểm hiện tại của học sinh
  const [elapsedTime, setElapsedTime] = useState(0); // Thời gian đã trôi qua (giây)

  const questions = exam?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const hasSubmitted = useRef(false); // Dùng để đảm bảo chỉ submit 1 lần
  const timerRef = useRef(null); // Ref cho interval của timer

  // Tính toán thời gian còn lại
  const timeLimitInSeconds = exam ? exam.duration * 60 : 0;
  const remainingTime = timeLimitInSeconds - elapsedTime;

  // Hàm nộp bài
  const submitExamResults = async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    clearInterval(timerRef.current); // Dừng timer

    // Tính tổng điểm tối đa của bài thi
    const maxPossibleScore = questions.reduce((sum, q) => sum + (q.score || 0), 0);

    try {
      await axios.post(
        `http://localhost:3000/api/exam/${exam._id}/results`,
        {
          userId: userId,
          examId: exam._id, // Đảm bảo exam._id tồn tại
          score: currentTotalScore,
          totalScoreFromAPI: maxPossibleScore, // Gửi tổng điểm tối đa
          timeSpent: elapsedTime,
          answers: userAnswers, // Gửi chi tiết câu trả lời của user
        }
      );
      toast.success("Nộp bài thành công!");
      navigate("/result", {
        state: {
          score: currentTotalScore,
          total: maxPossibleScore,
          elapsedTime,
          title: exam.title,
          code: exam.code,
          // bạn có thể truyền userAnswers nếu muốn trang kết quả hiển thị chi tiết
        },
      });
    } catch (error) {
      console.error("Lỗi khi lưu kết quả:", error);
      toast.error(error.response?.data?.message || "Lỗi khi nộp bài. Vui lòng thử lại.");
      // Vẫn cho xem kết quả tạm thời nếu không lưu được
      navigate("/result", {
        state: {
          score: currentTotalScore,
          total: maxPossibleScore,
          elapsedTime,
          title: exam.title,
          code: exam.code,
        },
      });
    }
  };

  useEffect(() => {
    if (!exam || !exam._id || questions.length === 0) {
      toast.error("Không có dữ liệu bài kiểm tra hợp lệ. Đang chuyển hướng...");
      setTimeout(() => navigate('/student-dashboard'), 2000);
      return;
    }

    // Khởi động timer
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timerRef.current); // Cleanup timer khi component unmount
  }, [exam, questions, navigate]);


  useEffect(() => {
    // Tự động nộp bài khi hết giờ
    if (exam && remainingTime <= 0 && !hasSubmitted.current) {
      toast.warn("Hết giờ làm bài! Bài của bạn sẽ được nộp tự động.");
      submitExamResults();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingTime, exam]); // Chỉ phụ thuộc remainingTime và exam để tránh re-run không cần thiết


  const handleOptionSelect = (selectedIndex) => {
    if (selectedOptionIndex !== null || !currentQuestion) return; // Không cho chọn lại nếu đã chọn hoặc không có câu hỏi

    setSelectedOptionIndex(selectedIndex); // Đánh dấu đáp án đã được chọn (cho UI)
    setAnsweredQuestionsCount(prevCount => prevCount + 1);

    const correctAnswerLetter = currentQuestion.correctAnswer; // ví dụ 'A'
    const correctAnswerIndex = ["A", "B", "C", "D"].indexOf(correctAnswerLetter);
    const isCorrect = selectedIndex === correctAnswerIndex;
    const scoreAwarded = isCorrect ? (currentQuestion.score || 1) : 0;

    if (isCorrect) {
      setCorrectAnswersCount(prevCount => prevCount + 1);
      setCurrentTotalScore(prevScore => prevScore + scoreAwarded);
    } else {
      setIncorrectAnswersCount(prevCount => prevCount + 1);
    }

    // Lưu lại câu trả lời của user (quan trọng cho việc xem lại lịch sử sau này)
    setUserAnswers(prevAnswers => [
      ...prevAnswers,
      {
        questionId: currentQuestion._id, // Hoặc ID của câu hỏi
        selectedOptionValue: currentQuestion.options[selectedIndex], // Lưu nội dung đáp án đã chọn
        selectedOptionIndex: selectedIndex, // Lưu index đáp án đã chọn
        correctAnswer: correctAnswerLetter,
        isCorrect: isCorrect,
        scoreAwarded: scoreAwarded
      }
    ]);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOptionIndex(null); // Reset lựa chọn cho câu hỏi mới
    } else {
      // Đây là câu hỏi cuối cùng, nộp bài
      submitExamResults();
    }
  };

  const formatCountdownTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} phút ${secs < 10 ? "0" : ""}${secs} giây`;
  };

  if (!exam || !currentQuestion) {
    return (
      <>
        <Navbar2 />
        <div className="quiz-container" style={{textAlign: 'center', paddingTop: '150px'}}>
          <h3>Đang tải dữ liệu bài kiểm tra hoặc đã xảy ra lỗi...</h3>
          <button onClick={() => navigate('/student-dashboard')} className="next-btn" style={{marginTop: '20px'}}>Quay lại</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar2 />
      <div className="quiz-container">
        {/* Khu vực hiển thị thông tin */}
        <div className="quiz-stats-header">
          <div className="progress-info">
            Câu: {currentQuestionIndex + 1}/{totalQuestions}
          </div>
          <div className="answered-info">
            Đã làm: {answeredQuestionsCount}/{totalQuestions}
          </div>
          <div className="score-info">
            Đúng: <span className="correct-count">{correctAnswersCount}</span> | Sai: <span className="incorrect-count">{incorrectAnswersCount}</span>
          </div>
          <div className="timer-box">
            ⏱️ {formatCountdownTime(remainingTime)}
          </div>
        </div>

        {remainingTime <= 60 && remainingTime > 0 && !hasSubmitted.current && (
            <div className="warning-timer">
              ⚠️ Còn {formatCountdownTime(remainingTime)}, nhanh lên!
            </div>
        )}

        <h2 className="question-text">{currentQuestion.content}</h2>

        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;
            let buttonClass = "option-btn";
            // Chỉ hiển thị màu đúng/sai SAU KHI đã chọn
            if (isSelected && selectedOptionIndex !== null) {
              const correctAnswerLetter = currentQuestion.correctAnswer;
              const correctAnswerIndex = ["A", "B", "C", "D"].indexOf(correctAnswerLetter);
              buttonClass += index === correctAnswerIndex ? " selected-correct" : " selected-incorrect";
            }

            return (
              <button
                key={index}
                className={buttonClass}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedOptionIndex !== null} // Vô hiệu hóa sau khi đã chọn 1 đáp án
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            );
          })}
        </div>

        <div className="navigation">
          <button
            className="next-btn"
            onClick={goToNextQuestion}
            // Chỉ bật nút Next khi đã chọn đáp án
            disabled={selectedOptionIndex === null && currentQuestionIndex < totalQuestions} 
          >
            {currentQuestionIndex < totalQuestions - 1
              ? "Câu tiếp theo →"
              : "Nộp bài & Xem kết quả"}
          </button>
        </div>
      </div>
    </>
  );
};

export default QuizPage;