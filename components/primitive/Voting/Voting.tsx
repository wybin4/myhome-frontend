import React, { useEffect, useState } from 'react';
import { VotingProps } from "./Voting.props";
import styles from "./Voting.module.css";
import CheckIcon from "./check.svg";

export const Voting = ({ isClose, activeId, options, onAnswer }: VotingProps): JSX.Element => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

    useEffect(() => {
        if (activeId !== 0) {
            setSelectedAnswer(activeId);
        }
    }, [activeId]);

    const getTotalVotesCount = () => {
        return Object.values(options.map(o => o.numberOfVotes)).reduce((sum, count) => sum + count, 0);
    };

    const getPercent = (answerId: number) => {
        const option = getAnswer(answerId);
        if (option) {
            return Math.round((option.numberOfVotes / getTotalVotesCount()) * 100);
        }
    };

    const getAnswer = (answerId: number) => {
        return options.find(o => o.id === answerId);
    };

    const setAnswer = (answerId: number) => {
        const option = options.find(o => o.id === answerId);
        if (option) {
            option.numberOfVotes += 1;
        }
        return option;
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
        if (selectedAnswer === answerId || isClose) {
            return;
        }

        setSelectedAnswer(answerId);
        setAnswer(answerId);
        onAnswer(answerId);
    };

    return (
        <div className={styles.voting}>
            <ul>
                {options.map((option, index) => (
                    <li key={index}>
                        <button
                            onClick={() => handleAnswer(option.id)}
                            disabled={selectedAnswer !== null || isClose} // Блокировка после выбора
                            className={styles.option}
                            style={{
                                background: getBackground(option.id)
                            }}
                        >
                            <div>{option.text}</div>
                            {selectedAnswer &&
                                <>
                                    <div className="text-center">{getAnswer(option.id)?.numberOfVotes}</div>
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
