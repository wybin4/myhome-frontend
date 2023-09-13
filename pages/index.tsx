import { Button } from "@/components";

export default function Home(): JSX.Element {
    return (
        <div>
            <Button appearance="primary" symbol="upload">Привет!</Button>
            <Button appearance="primary" symbol="download">Привет!</Button>
            <Button appearance="primary" symbol="add">Привет!</Button>
            <Button appearance="ghost" symbol="upload">Привет, друг!</Button>
            <Button appearance="ghost" symbol="download">Привет, друг!</Button>
            <Button appearance="ghost" symbol="add">Привет, друг!</Button>
        </div>
    );
}