// frontend/src/pages/StudentHistoryDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar2 from './Navbar2';
import Footer from './Footer';
import './StudentHistoryDetailPage.css'; 
import { toast } from 'react-toastify';

// --- START MOCK DATA (Giữ nguyên mock data từ lần trước hoặc cập nhật nếu cần) ---
const MOCK_USER_ID_FOR_HISTORY_DETAIL = "student123"; 
const mockUserExamHistory_Updated_For_Detail = [
  { _id: "submission001", userId: MOCK_USER_ID_FOR_HISTORY_DETAIL, examCode: "KTGK-TOAN10", examTitle: "Kiểm tra giữa kỳ Toán lớp 10", dateCompleted: "2025-05-10T10:30:00Z", score: 10, totalPossibleScore: 20, timeSpent: 1230, totalQuestionsInSubmission: 2, correctAnswersInSubmission: 1, incorrectAnswersInSubmission: 1 },
  { _id: "submission002", userId: MOCK_USER_ID_FOR_HISTORY_DETAIL, examCode: "VATLY_15P_CH2", examTitle: "Vật Lý 15 phút - Chương 2", dateCompleted: "2025-05-12T14:00:00Z", score: 5, totalPossibleScore: 10, timeSpent: 850, totalQuestionsInSubmission: 2, correctAnswersInSubmission: 1, incorrectAnswersInSubmission: 1 }
];
const mockSubmissionDetailsDataStore_Updated_For_Detail = {
  submission001: {
    submission: mockUserExamHistory_Updated_For_Detail.find(s => s._id === "submission001"),
    examDetails: { 
        _id: "examId1", title: "Kiểm tra giữa kỳ Toán lớp 10", code: "KTGK-TOAN10", 
        questions: [ 
            { _id: "q1", content: "Câu hỏi 1: 1 + 1 bằng mấy?", options: ["Một", "Hai", "Ba", "Bốn"], correctAnswerLetter: "B", score: 10 }, 
            { _id: "q2", content: "Câu hỏi 2: Mặt trời mọc ở hướng nào?", options: ["Tây", "Nam", "Đông", "Bắc"], correctAnswerLetter: "C", score: 10 }
        ]
    },
    userAnswersForThisSubmission: [ 
        { questionId: "q1", selectedOptionValue: "Hai", isCorrect: true }, 
        { questionId: "q2", selectedOptionValue: "Tây", isCorrect: false }
    ]
  },
  submission002: {
    submission: mockUserExamHistory_Updated_For_Detail.find(s => s._id === "submission002"),
    examDetails: { 
        _id: "examId2", title: "Vật Lý - Bài 15 phút", code: "VATLY_15P_CH2", 
        questions: [ 
            { _id: "q2_1", content: "Đơn vị của lực là gì?", options: ["Joule", "Watt", "Newton", "Pascal"], correctAnswerLetter: "C", score: 5 }, 
            { _id: "q2_2", content: "Gia tốc trọng trường có giá trị xấp xỉ bao nhiêu?", options: ["9.8 m/s^2", "10 m/s^2", "1.6 m/s^2", "3.0 m/s^2"], correctAnswerLetter: "A", score: 5 }
        ]
    },
    userAnswersForThisSubmission: [
         { questionId: "q2_1", selectedOptionValue: "Newton", isCorrect: true }, 
         { questionId: "q2_2", selectedOptionValue: "10 m/s^2", isCorrect: false }
    ]
  }
};
const getMockSubmissionDetail_Updated = (submissionId) => {
    return mockSubmissionDetailsDataStore_Updated_For_Detail[submissionId];
};
// --- END MOCK DATA ---

const StudentHistoryDetailPage = () => {
  const { submissionId } = useParams(); 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissionDetails = () => {
      setLoading(true);
      setTimeout(() => {
        const data = getMockSubmissionDetail_Updated(submissionId);
        if (data) {
          setDetails(data);
        } else {
          toast.error('Không tìm thấy chi tiết bài làm này.');
        }
        setLoading(false);
      }, 300);
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

  if (loading) return ( <> <Navbar2 /> <div className="history-detail-page-container loading-message"><p>Đang tải chi tiết...</p></div> <Footer /> </>);
  if (!details || !details.submission || !details.examDetails) return ( <> <Navbar2 /> <div className="history-detail-page-container error-message"><p>Không có dữ liệu chi tiết cho bài làm này.</p><Link to="/history" className="back-to-history-list-btn">‹ Quay lại Lịch sử</Link></div> <Footer /> </>);

  const { submission, examDetails, userAnswersForThisSubmission } = details;
  
  const totalQuestions = submission.totalQuestionsInSubmission || examDetails.questions.length;
  const correctCount = submission.correctAnswersInSubmission;
  const incorrectCount = submission.incorrectAnswersInSubmission !== undefined 
                         ? submission.incorrectAnswersInSubmission 
                         : totalQuestions - correctCount;

  return (
    <>
      <Navbar2 />
      <div className="history-detail-page-container">
        <div className="history-detail-header">
          <p><strong>Mã bài kiểm tra:</strong> {examDetails.code}</p>
          <div className="history-summary-stats">
            <span><strong>Tổng số câu:</strong> {totalQuestions}</span>
            <span><strong>Số câu đúng:</strong> <span className="summary-correct">{correctCount}</span></span>
            <span><strong>Số câu sai:</strong> <span className="summary-incorrect">{incorrectCount}</span></span>
            <span><strong>Thời gian làm bài:</strong> {formatTimeSpent(submission.timeSpent)}</span>
          </div>
        </div>

        <div className="history-questions-list">
          {examDetails.questions.map((examQuestion, index) => {
            const userAnswer = userAnswersForThisSubmission.find(ua => ua.questionId === examQuestion._id);
            const studentChoiceContent = userAnswer?.selectedOptionValue;
            const systemCorrectAnswerLetter = examQuestion.correctAnswerLetter; 
            
            return (
              <div 
                key={examQuestion._id || index} 
                className={`history-question-card ${userAnswer ? (userAnswer.isCorrect ? 'user-answered-correct' : 'user-answered-incorrect') : 'user-not-answered'}`}
              >
                <div className="history-question-title">
                  Câu {index + 1}: {examQuestion.content}
                </div>
                <div className="history-answers-group">
                  {examQuestion.options.map((optionText, optIndex) => {
                    const optionLetter = getOptionLetter(optIndex);
                    const isStudentChoice = optionText === studentChoiceContent;
                    const isSystemCorrectAnswer = optionLetter === systemCorrectAnswerLetter;

                    let optionClassName = "history-answer-option";
                    let isStudentCorrectAndChoseThis = false;

                    if (isStudentChoice) { // Đây là lựa chọn của học sinh
                      if (userAnswer?.isCorrect) {
                        optionClassName += " student-chose-correct"; // Học sinh chọn đúng
                        isStudentCorrectAndChoseThis = true;
                      } else {
                        optionClassName += " student-chose-incorrect"; // Học sinh chọn sai
                      }
                    } else if (isSystemCorrectAnswer) { // Đây là đáp án đúng của hệ thống (và HS không chọn nó)
                       optionClassName += " system-is-correct"; 
                    }

                    return (
                      <div key={optIndex} className={optionClassName}>
                        <span className="history-option-letter">{optionLetter}.</span>
                        <span className="history-option-text">{optionText}</span>
                        {/* Chỉ báo chỉ hiển thị trên lựa chọn của học sinh */}
                        {isStudentChoice && userAnswer?.isCorrect && <span className="answer-status-badge correct-badge">✔</span>}
                        {isStudentChoice && !userAnswer?.isCorrect && <span className="answer-status-badge incorrect-badge">✘</span>}
                      </div>
                    );
                  })}
                </div>
                {/* Hiển thị "Đáp án đúng: X" chỉ khi học sinh làm sai */}
                {userAnswer && !userAnswer.isCorrect && (
                    <p className="system-correct-answer-feedback">Đáp án đúng: {systemCorrectAnswerLetter}</p>
                )}
                {!userAnswer && ( 
                     <p className="not-answered-feedback">Không trả lời. Đáp án đúng: {systemCorrectAnswerLetter}.</p>
                )}
              </div>
            );
          })}
        </div>
        <Link to="/history" className="back-to-history-list-btn">‹ Quay lại Danh sách</Link>
      </div>
      <Footer />
    </>
  );
};

export default StudentHistoryDetailPage;