(window as any).createBackVideo = (
    videoSrc: string, imageSrc: string,
    originWidth: number, originHeight: number,
    onLoadImage: () => {}, onLoadVideo: () => {}): void => {
    console.log('backVideo: powered by www.frydlewicz.pl');

    if (!videoSrc || !originWidth || !originHeight) {
        throw new Error('createBackVideo: incorrect parameters!');
    }

    const container: HTMLDivElement = document.createElement('div');
    let image: HTMLImageElement;
    const video: HTMLVideoElement = document.createElement('video');

    if (imageSrc) {
        image = document.createElement('img');
        image.style.position = 'absolute';
        image.style.zIndex = '1';
        image.onload = (): void => {
            if (typeof onLoadImage === 'function') {
                onLoadImage();
            }
        };
        image.src = imageSrc;
        container.appendChild(image);
    }

    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.controls = false;
    video.preload = 'none';
    video.style.position = 'absolute';
    video.onloadeddata = (): void => {
        if (imageSrc) {
            image.style.display = 'none';
        }
        if (typeof onLoadVideo === 'function') {
            onLoadVideo();
        }
    };
    setTimeout((): void => {
        video.src = videoSrc;
    }, 1);
    container.appendChild(video);

    setSizeAndPosition();
    addEventListener('resize', (): void => setSizeAndPosition());

    container.id = 'backVideo';
    container.style.position = 'fixed';
    container.style.zIndex = '-1';
    container.style.width = container.style.height = '100%';
    container.style.overflow = 'hidden';

    const first: ChildNode = document.body.firstChild;

    first.parentNode.insertBefore(container, first);

    function setSizeAndPosition(): void {
        const windowWidth: number = window.innerWidth;
        const windowHeight: number = window.innerHeight;

        if (!windowWidth || !windowHeight) {
            throw new Error('createBackVideo: window dimensions problem!');
        }

        let width: number;
        let height: number;
        let left: number;
        let top: number;

        if (originWidth / originHeight < windowWidth / windowHeight) {
            width = windowWidth;
            height = windowWidth * (originHeight / originWidth);
            left = 0;
            top = -Math.round((height - windowHeight) / 2);
        } else {
            width = windowHeight * (originWidth / originHeight);
            height = windowHeight;
            left = -Math.round((width - windowWidth) / 2);
            top = 0;
        }

        if (imageSrc) {
            image.width = width;
            image.height = height;
            image.style.left = left + 'px';
            image.style.top = top + 'px';
        }

        video.width = width;
        video.height = height;
        video.style.left = left + 'px';
        video.style.top = top + 'px';
    }
};
