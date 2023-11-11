import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { HistogramProps } from './Histogram.props';
import { formatDateToRussian } from '@/helpers/translators';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const Histogram = ({ data }: HistogramProps) => {
    const [chartData, setChartData] = useState<{
        datasets: {
            label: string,
            data: { x: string; y: number; }[],
            borderColor: string,
            backgroundColor: string,
        }[],
    }>({
        datasets: [],
    });
    const [chartOptions, setChartOptions] = useState({});

    const colors = [
        getComputedStyle(document.documentElement).getPropertyValue('--primary'),
        getComputedStyle(document.documentElement).getPropertyValue('--primary-light-hover'),
    ];

    useEffect(() => {
        setChartData({
            datasets: data.map((d, i) => {
                const color = i % 2 === 0 ? colors[0] : colors[1];
                return {
                    label: d.label,
                    data: d.data
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(d => {
                            return {
                                x: formatDateToRussian(new Date(d.date)),
                                y: d.total
                            };
                        }),
                    borderColor: "white",
                    backgroundColor: color,
                };
            })
        });
        setChartOptions({
            plugins: {
                legend: {
                    position: 'top',
                    display: true,
                    labels: {
                        usePointStyle: true,
                        boxHeight: 6
                    },
                },
                tooltip: {
                    displayColors: false
                }
            },
            maintainAspectRatio: false,
            responsive: true
        });
    }, []);

    return (
        <>
            <div className='w-full md:col-span-2 relative lg:h-[70vh] h-[50vh] m-auto p-4 border rounded-lg bg-white'>
                <Bar data={chartData} options={chartOptions} />
            </div>
        </>
    );
};