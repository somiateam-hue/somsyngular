import React, { useEffect, useRef } from 'react';

/**
 * Renders the 3D poem animation hero section.
 */
export const PoemAnimation = ({ poemHTML, backgroundImageUrl, boyImageUrl }) => {
    const contentRef = useRef(null);

    // This effect handles the responsive scaling of the animation container.
    useEffect(() => {
        function adjustContentSize() {
            if (contentRef.current) {
                const viewportWidth = window.innerWidth;
                const baseWidth = 1000;
                const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1;
                contentRef.current.style.transform = `scale(${scaleFactor})`;
            }
        }

        adjustContentSize();
        window.addEventListener("resize", adjustContentSize);
        return () => window.removeEventListener("resize", adjustContentSize);
    }, []);

    return (
        <header className="hero-section" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container" style={{ position: 'absolute' }}>
                <div 
                    ref={contentRef} 
                    className="content" 
                    style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '1000px', height: '562px', overflow: 'hidden', margin: '0 auto' }}
                >
                    <div className="container-full" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
                        <div className="animated hue"></div>
                        <img className="backgroundImage" src={backgroundImageUrl} alt="An old stone courtyard at dawn" onError={(e) => e.target.style.display = 'none'} />
                        <img className="boyImage" src={boyImageUrl} alt="A man and woman practicing with swords" onError={(e) => e.target.style.display = 'none'} />
                        
                        <div className="cube-wrapper">
                            <div className="cube">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                            </div>
                        </div>

                        <div className="container-reflect">
                            <div className="cube">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: poemHTML }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
