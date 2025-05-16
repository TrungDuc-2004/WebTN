import React from "react";
import "./ProcessSection.css";
import mot from "../assets/mot.jpg";
import hai from "../assets/hai.png";
import ba from "../assets/ba.png";
import bon from "../assets/bon.png";
import nam from "../assets/nam.png";
import chart from "../assets/chart.png";

const ProcessSection = () => {
  return (
    <section className="process-section">
      <div className="process-container">
        <h2 className="process-title">Cách ThinkFast hoạt động</h2>

        <div className="process-steps">
          <div className="process-step">
            <div className="step-content">
              <div className="step-image">
                <img
                  src={mot}
                  alt="Giáo viên tạo bài thi"
                  className="process-image"
                />
              </div>
              <div className="step-info">
                <div className="step-number">01</div>
                <div className="step-text">
                  <p>Giáo viên tạo bài thi</p>
                </div>
              </div>
            </div>
          </div>
          <div className="process-step">
            <div className="step-content">
              <div className="step-image">
                <img
                  src={hai}
                  alt="Thêm câu hỏi vào bài thi"
                  className="process-image"
                />
              </div>
              <div className="step-info">
                <div className="step-number">02</div>
                <div className="step-text">
                  <p>Giáo viên thêm câu hỏi vào bài thi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="process-step">
            <div className="step-content">
              <div className="step-image">
                <img
                  src={ba}
                  alt="Thêm học sinh vào bài thi"
                  className="process-image"
                />
              </div>
              <div className="step-info">
                <div className="step-number">03</div>
                <div className="step-text">
                  <p>Giáo viên thêm học sinh vào bài thi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="process-step">
            <div className="step-content">
              <div className="step-image">
                <img
                  src={bon}
                  alt="Học sinh làm bài thi"
                  className="process-image"
                />
              </div>
              <div className="step-info">
                <div className="step-number">04</div>
                <div className="step-text">
                  <p>Học sinh làm bài thi</p>
                </div>
              </div>
            </div>
          </div>

          <div className="process-step">
            <div className="step-content">
              <div className="step-image">
                <img
                  src={nam}
                  alt="Học sinh xem điểm"
                  className="process-image"
                />
              </div>
              <div className="step-info">
                <div className="step-number">05</div>
                <div className="step-text">
                  <p>Học sinh xem điểm sau khi kiểm tra</p>
                </div>
              </div>
            </div>
          </div>

          <div className="process-step">
            <div className="step-content">
              <div className="step-image">
                <img
                  src={chart}
                  alt="Thống kê kết quả"
                  className="process-image"
                />
              </div>
              <div className="step-info">
                <div className="step-number">06</div>
                <div className="step-text">
                  <p>Giáo viên xem điểm, thống kê bài thi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
