import Image from 'next/image';

export default function Splash (){
	return (
		<div className="h-screen w-full flex items-center justify-center">
			<Image
				src="/splash.png"
				alt="NEXUS image"
				width={200}
				height={200}
				className="object-contain"
				onError={() => console.error("Logo failed to load")}
			/>
		</div>
	)
		
}