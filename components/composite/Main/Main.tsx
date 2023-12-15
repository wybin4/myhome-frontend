import { MainProps, PossibilityMenuProps } from "./Main.props";
import styles from "./Main.module.css";
import cn from 'classnames';
import BackgroundIcon from "./icons/background.svg";
import OwnerIcon from "./icons/owner.svg";
import MCIcon from "./icons/managementCompany.svg";
import ReferenceIcon from "./icons/reference.svg";
import BillIcon from "./icons/bill.svg";
import NotificationIcon from "./icons/notification.svg";
import AppealIcon from "./icons/appeal.svg";
import ChatIcon from "./icons/chat.svg";
import VotingIcon from "./icons/voting.svg";
import SubscriberIcon from "./icons/subscriber.svg";
import SPDIcon from "./icons/spd.svg";
import MeterIcon from "./icons/meter.svg";
import TariffIcon from "./icons/tariff.svg";
import ListIcon from "./icons/list.svg";
import CommonIcon from "./icons/common.svg";
import { UserRole } from "@/interfaces/account/user.interface";

export const Main = ({ userRole, className, ...props }: MainProps): JSX.Element => {

    return (
        <>
            <div className={cn(className, {
                [styles.referenceMainMC]: userRole === UserRole.ManagementCompany,
                [styles.referenceMainOwner]: userRole === UserRole.Owner,
            })} {...props}>
                <span className={styles.background}><BackgroundIcon /></span>
                <p className={styles.title}>Мой дом</p>
                {userRole === UserRole.Owner &&
                    <div className={styles.owner}>
                        <p className={styles.description}>
                            Ваш личный помощник по дому для передачи показаний счетчиков и оплаты квитанций.
                        </p>
                        <span className={styles.ownerIcon}><OwnerIcon /></span>
                        <PossibilityMenu items={[
                            {
                                name: "Счётчики",
                                icon: <MeterIcon />,
                                description: "Легко и быстро передавайте показания счетчиков. Отслеживайте состояние приборов учета и историю показаний."
                            }, {
                                name: "Оплата",
                                icon: <BillIcon />,
                                description: "Приближается срок оплаты квитанции? На сайте можно быстро произвести оплату любой банковской картой"
                            }, {
                                name: "События",
                                icon: <NotificationIcon />,
                                description: "Все важные события в единой ленте новостей, а не на дверях подъезда. Узнавайте о важных событиях в доме на сайте."
                            }, {
                                name: "Квитанции",
                                icon: <SPDIcon />,
                                description: "Отслеживайте повышение тарифов и расходов за коммунальные платежи благодаря архиву квитанций и графику начислений",
                                stroke: true
                            }, {
                                name: "Чаты",
                                icon: <ChatIcon />,
                                description: "Будьте на связи с Вашей обслуживающей организацией и другими собственниками с помощью чата",
                                stroke: true
                            }, {
                                name: "Опросы",
                                icon: <VotingIcon />,
                                description: "Участвуйте в опросах и онлайн голосованиях, чтобы выразить свое мнение."
                            }
                        ]} />
                        <button className={styles.possibs}>Возможности</button>
                    </div>
                }
                {userRole === UserRole.ManagementCompany &&
                    <div className={styles.mc}>
                        <p className={styles.description}>
                            Помогает рассчитывать квартплату, учитывать жилой фонд, обслуживать собственников помещений и вести претензионную работу.
                        </p>
                        <span className={styles.mcIcon}><MCIcon /></span>
                        <PossibilityMenu items={[
                            {
                                name: "Справочники",
                                icon: <ReferenceIcon />,
                                stroke: true
                            }, {
                                name: "Квитанции",
                                icon: <BillIcon />
                            },
                            {
                                name: "Уведомления",
                                icon: <NotificationIcon />
                            }, {
                                name: "Обращения",
                                icon: <AppealIcon />
                            }, {
                                name: "Чаты",
                                icon: <ChatIcon />,
                                stroke: true
                            }, {
                                name: "Опросы",
                                icon: <VotingIcon />
                            }
                        ]} />
                        <div className={styles.listWrapper}>
                            <div>
                                <p className={styles.titleSecond}>Самое сложное мы сделаем за вас!</p>
                                <p className={styles.descriptionSecond}>Мы знаем, насколько сложно эффективно вести учет жилого фонда и обеспечивать прозрачные процессы для собственников, поэтому берем это на себя.</p>
                            </div>
                            <div className="flex flex-row gap-[4rem]">
                                <div>
                                    <p className={styles.listDesc}>
                                        <span className={styles.descIcon}><SubscriberIcon /></span>
                                        <span className={styles.listDescTitle}>
                                            Заполните справочники лицевых счетов
                                        </span>
                                    </p>
                                    <p className={styles.listDesc}>
                                        <span className={styles.descIcon}><MeterIcon /></span>
                                        <span className={styles.listDescTitle}>
                                            Заполните справочники приборов учета
                                        </span>
                                    </p>
                                    <p className={styles.listDesc}>
                                        <span className={styles.descIcon}><TariffIcon /></span>
                                        <span className={styles.listDescTitle}>
                                            Заполните тарифы и нормативы
                                        </span>
                                    </p>
                                    <p className={styles.listDesc}>
                                        <span className={styles.descIconStroke}><SPDIcon /></span>
                                        <span className={styles.listDescTitle}>
                                            Сформируйте единый платежный документ
                                        </span>
                                    </p>
                                </div>
                                <span className={styles.listIcon}> <ListIcon /></span>
                            </div>
                        </div>
                        <button className={styles.possibs}>Возможности</button>
                    </div>
                }
                {userRole === UserRole.Admin &&
                    <>
                        <p className={styles.description}>
                            Помогаем собственникам и управляющим компаниям делать мир лучше.
                        </p>
                        <span className={styles.ownerIcon}><CommonIcon /></span>
                    </>
                }
                {userRole === UserRole.None &&
                    <>
                        <p className={styles.description}>
                            Помогаем собственникам и управляющим компаниям делать мир лучше.
                        </p>
                        <span className={styles.ownerIcon}><CommonIcon /></span>
                        <button className={styles.possibs}><a href="/login">Войти</a></button>
                    </>
                }
            </div>
        </>
    );
};

const PossibilityMenu = ({ items }: PossibilityMenuProps) => {
    return (
        <div className={styles.totalPossWrapper}>
            {items.map((item, key) => (
                <div key={key}>
                    <div className={styles.possibilityWrapper}>
                        <span className={cn(styles.possibilityIcon, {
                            [styles.possibilityIconWithFill]: !item.stroke,
                            [styles.possibilityIconWithStroke]: item.stroke
                        })}>{item.icon}</span>
                        <span className={styles.possibilityName}>{item.name}</span>
                    </div>
                    {item.description && <div className={styles.possibilityDescription}>{item.description}</div>}
                </div>
            ))}
        </div>
    );
};