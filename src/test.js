import domready from "domready"
import QuickHull from "quickhull"
import "./style.css"
import Color from "./Color";
import weightedRandom from "./weightedRandom";


const PHI = (1 + Math.sqrt(5)) / 2;
const TAU = Math.PI * 2;
const DEG2RAD_FACTOR = TAU / 360;

const config = {
    width: 0,
    height: 0,
    size: 0
};

/**
 * @type CanvasRenderingContext2D
 */
let ctx;
let canvas;


export class AABB {

    minX = Infinity;
    minY = Infinity;
    maxX = -Infinity;
    maxY = -Infinity;


    add(x, y)
    {
        this.minX = Math.min(this.minX, x);
        this.minY = Math.min(this.minY, y);
        this.maxX = Math.max(this.maxX, x);
        this.maxY = Math.max(this.maxY, y);
    }


    get x()
    {
        return this.minX;
    }


    get y()
    {
        return this.minY;
    }


    get w()
    {
        return (this.maxX - this.minX) | 0;
    }


    reset()
    {
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    }


    get h()
    {
        return (this.maxY - this.minY) | 0;
    }

}



domready(
    () => {

        canvas = document.getElementById("screen");
        ctx = canvas.getContext("2d");

        const width = (window.innerWidth) | 0;
        const height = (window.innerHeight) | 0;

        config.width = width;
        config.height = height;

        canvas.width = width;
        canvas.height = height;

        const paint = () => {

            const step = 1 / 6;
            for (let i=0; i < 6; i++)
            {
                const hue = step * i;
                ctx.fillStyle = Color.fromHSL(hue, 1, hue >= 1/6 && hue < 4/6 ? 0.4 : 0.6).toRGBHex();
                ctx.fillRect(0,i * 110, 100, 100);
            }


        }

        paint();

        window.addEventListener("click", paint, true)
    }
);
