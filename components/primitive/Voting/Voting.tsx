import React, { useState } from 'react';
import { VotingProps } from "./Voting.props";
import styles from "./Voting.module.css";
import CheckIcon from "./check.svg";

export const Voting = ({ options, answers, onAnswer }: VotingProps): JSX.Element => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    const getTotalVotesCount = () => {
        return Object.values(answers).reduce((sum, count) => sum + count, 0);
    };

    const getPercent = (answerId: number) => {
        return Math.round((answers[answerId - 1] / getTotalVotesCount()) * 100);
    };

    const getBackground = (answerId: number) => {
        if (selectedAnswer) {
            const percentage = getPercent(answerId);
            return `linear-gradient(90deg, var(--voting-dark) ${percentage}%, var(--voting) ${percentage}%)`;
        }
        return 'linear-gradient(90deg, var(--voting) 0%, var(--voting) 0%)';
    };

    const handleAnswer = (answerId: number) => {
        // Проверка, был ли выбран этот ответ ранее
        if (selectedAnswer === answerId) {
            return;
        }

        setSelectedAnswer(answerId);
        answers[answerId - 1] += 1;
        onAnswer(answerId);
    };

    return (
        <div className={styles.voting}>
            <ul>
                {options.map((option, index) => (
                    <li key={index}>
                        <button
                            onClick={() => handleAnswer(option.id)}
                            disabled={selectedAnswer !== null} // Блокировка после выбора
                            className={styles.option}
                            style={{
                                background: getBackground(option.id)
                            }}
                        >
                            <div>{option.text}</div>
                            {selectedAnswer &&
                                <>
                                    <div className="text-center">{answers[option.id - 1]}</div>
                                    <div className="text-right flex items-center justify-end">
                                        {selectedAnswer === option.id && <span className="mr-3"><CheckIcon /></span>}
                                        {getPercent(option.id)}%
                                    </div>
                                </>
                            }
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
