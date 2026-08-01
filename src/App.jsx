import './App.css';
import React, { useMemo, useState } from 'react';

const WEEKLY_PLANS = [
    {
        id: 'week-1',
        label: 'Week of Aug 5',
        bookTitle: 'Last Stop on Market Street',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        questions: [
            'Who are the main characters in this story?',
            'What is one challenge a character faces, and how do they respond?',
            'What lesson does this story teach?'
        ]
    },
    {
        id: 'week-2',
        label: 'Week of Aug 12',
        bookTitle: 'Jabari Jumps',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        questions: [
            'What does Jabari want to do, and what is he nervous about?',
            'How does Jabari prepare before taking action?',
            'Describe a time you felt brave like Jabari.'
        ]
    }
];

const STUDENTS = [
    { id: 'student-1', name: 'Aaliyah', grade: 'K' },
    { id: 'student-2', name: 'Mateo', grade: '1' },
    { id: 'student-3', name: 'Nia', grade: '3' }
];

const TRACKER_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function createStudentWeekKey(weekId, studentId) {
    return `${weekId}:${studentId}`;
}

function App() {
    const [selectedWeekId, setSelectedWeekId] = useState(WEEKLY_PLANS[0].id);
    const [completedQuestions, setCompletedQuestions] = useState({});
    const [completedTrackerDays, setCompletedTrackerDays] = useState({});

    const selectedWeek = useMemo(
        () => WEEKLY_PLANS.find((week) => week.id === selectedWeekId) || WEEKLY_PLANS[0],
        [selectedWeekId]
    );

    function handleQuestionToggle(studentId, questionIndex) {
        const key = createStudentWeekKey(selectedWeek.id, studentId);
        setCompletedQuestions((previous) => {
            const existingIndexes = previous[key] || [];
            const nextIndexes = existingIndexes.includes(questionIndex)
                ? existingIndexes.filter((index) => index !== questionIndex)
                : [...existingIndexes, questionIndex];

            return {
                ...previous,
                [key]: nextIndexes
            };
        });
    }

    function handleTrackerDayToggle(studentId, day) {
        const key = createStudentWeekKey(selectedWeek.id, studentId);
        setCompletedTrackerDays((previous) => {
            const existingDays = previous[key] || [];
            const nextDays = existingDays.includes(day)
                ? existingDays.filter((item) => item !== day)
                : [...existingDays, day];

            return {
                ...previous,
                [key]: nextDays
            };
        });
    }

    function getStudentProgress(studentId) {
        const key = createStudentWeekKey(selectedWeek.id, studentId);
        const doneQuestions = (completedQuestions[key] || []).length;
        const doneTrackerDays = (completedTrackerDays[key] || []).length;
        const totalTasks = selectedWeek.questions.length + TRACKER_DAYS.length;
        const completedTasks = doneQuestions + doneTrackerDays;
        return Math.round((completedTasks / totalTasks) * 100);
    }

    return (
        <main className="app-shell">
            <section className="hero-card">
                <p className="eyebrow">Reading Prescriptions</p>
                <h1>Weekly reading assignments for every student</h1>
                <p className="lead">
                    Assign a book PDF, track comprehension, and keep students motivated with a visual
                    weekly tracker families can complete at home.
                </p>
            </section>

            <section className="control-card" aria-label="Weekly assignment controls">
                <div>
                    <p className="eyebrow">Step 1</p>
                    <h2>Select the week</h2>
                </div>
                <label className="week-select-label" htmlFor="week-select">
                    Weekly assignment
                </label>
                <select
                    id="week-select"
                    className="week-select"
                    value={selectedWeek.id}
                    onChange={(event) => setSelectedWeekId(event.target.value)}
                >
                    {WEEKLY_PLANS.map((week) => (
                        <option key={week.id} value={week.id}>
                            {week.label}
                        </option>
                    ))}
                </select>
                <p className="hint-text">Tip: replace the sample PDF links with your uploaded weekly books.</p>
            </section>

            <section className="students-grid" aria-label="Student weekly assignments">
                {STUDENTS.map((student) => {
                    const key = createStudentWeekKey(selectedWeek.id, student.id);
                    const doneQuestions = completedQuestions[key] || [];
                    const doneDays = completedTrackerDays[key] || [];
                    const progress = getStudentProgress(student.id);

                    return (
                        <article className="student-card" key={student.id}>
                            <header className="student-card-header">
                                <div>
                                    <h3>{student.name}</h3>
                                    <p>Grade {student.grade}</p>
                                </div>
                                <span className="progress-pill">{progress}% done</span>
                            </header>

                            <section>
                                <h4>Weekly book PDF</h4>
                                <p className="book-title">{selectedWeek.bookTitle}</p>
                                <a href={selectedWeek.pdfUrl} target="_blank" rel="noreferrer" className="book-link">
                                    Open PDF
                                </a>
                            </section>

                            <section>
                                <h4>Comprehension questions</h4>
                                <ul className="question-list">
                                    {selectedWeek.questions.map((question, index) => {
                                        const checked = doneQuestions.includes(index);
                                        return (
                                            <li key={question}>
                                                <button
                                                    type="button"
                                                    className={`task-toggle ${checked ? 'task-toggle-on' : ''}`}
                                                    onClick={() => handleQuestionToggle(student.id, index)}
                                                    aria-pressed={checked}
                                                >
                                                    <span>{checked ? 'Done' : 'Mark done'}</span>
                                                </button>
                                                <p>{question}</p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </section>

                            <section>
                                <h4>Fun weekly tracker</h4>
                                <div className="tracker-row" role="group" aria-label="Weekly tracker days">
                                    {TRACKER_DAYS.map((day) => {
                                        const checked = doneDays.includes(day);
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                className={`tracker-day ${checked ? 'tracker-day-on' : ''}`}
                                                onClick={() => handleTrackerDayToggle(student.id, day)}
                                                aria-pressed={checked}
                                            >
                                                <span>{day}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="progress-track" aria-hidden="true">
                                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                                </div>
                            </section>
                        </article>
                    );
                })}
            </section>
        </main>
    );
}

export default App;