import React, { useState } from 'react';

const OnHover = ({ onHover, offHover }) => {
	const [hovering, setHovering] = useState(false);

	return (
		<div
			style={{ height: '100%' }}
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			{offHover}
			{hovering && (
				<div
					style={{
						backgroundColor: 'rgba(0,0,0,0.55)',
						height: '100%',
						left: 0,
						position: 'absolute',
						top: 0,
						width: '100%',
					}}
				>
					{onHover}
				</div>
			)}
		</div>
	);
};

export default OnHover;
