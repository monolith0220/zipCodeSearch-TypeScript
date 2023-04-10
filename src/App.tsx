import { useState } from "react";

type Address = {
	address1: string;
	address2: string;
	address3: string;
};

type ZipcodeResult = {
	message: string;
	results: Address[];
	status: number;
};

const App = (): JSX.Element => {
	const [postalCode, setPostalCode] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>("");
	const [address, setAddress] = useState<string>("");

	const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		if (event.target.value.length <= 7) {
			setPostalCode(event.target.value);
		} else {
			setError("郵便番号が7桁を超えています");
		}
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();
		setIsLoading(true);
		setError("");
		try {
			const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`);
			console.log(response);
			const data: ZipcodeResult = await response.json();
			console.log(data);
			if (data.results && data.results.length > 0) {
				setAddress(data.results[0].address1 + data.results[0].address2 + data.results[0].address3);
			} else {
				setAddress("住所が見つかりませんでした。");
			}
		} catch (error) {
			setError("住所の検索中にエラーが発生しました。");
		}
		setIsLoading(false);
	};

	return (
		<div>
			<header>
				<h1>郵便番号検索</h1>
				<p>※ハイフンなしで入力してください</p>
				<form onSubmit={handleSubmit}>
					<input type="text" value={postalCode} onChange={handlePostalCodeChange} />
					<button type="submit">検索</button>
				</form>
			</header>
			<main>
				{isLoading && <div>検索中...</div>}
				{error && <div style={{ color: "red" }}>{error}</div>}
				{address && <div>{address}</div>}
			</main>
		</div>
	);
};

export default App;
