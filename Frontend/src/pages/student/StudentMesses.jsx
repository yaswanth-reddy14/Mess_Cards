import StudentHeader from "../../components/StudentHeader";
import BackButton from "../../components/BackButton";
import "../../App.css";

export default function StudentMesses() {
  return (
    <>
      <StudentHeader />

      <div className="page-container">
        <BackButton />

        <h2 className="page-title">My Messes</h2>

        <p className="empty-text">
          Student Mess List (Nearby messes later)
        </p>
      </div>
    </>
  );
}
