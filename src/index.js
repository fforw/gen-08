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

        const size = Math.max(width / 2, height / 2);
        config.size = size;

        const paint = () => {

            const hue = Math.random() * 0.5;
            const hue2 = hue + 0.5;

            const colors = weightedRandom([
                0.8, Color.from("#000").toRGBA(0.9),
                2, Color.fromHSL(hue, 1, hue >= 1/6 && hue < 4/6 ? 0.4 : 0.6).toRGBA(0.7),
                0.5, Color.fromHSL(hue2, 1, hue2 >= 1/6 && hue2 < 4/6 ? 0.4 : 0.6).toRGBA(0.9),
                1.5, Color.from("#fff").toRGBA(0.9)
            ])


            const hw = width / 2;
            const hh = height / 2;

            ctx.fillStyle = "#16161d";
            ctx.fillRect(0, 0, width, height);

            const numBlobs = 800 + 700 * Math.random();

            const blobs = [];

            const aabb = new AABB();

            const pad = 2;

            for (let i = 0; i < numBlobs; i++)
            {
                const rnd = Math.random();

                const angle = TAU * Math.random();
                const rnd2 = Math.random()
                const r = 0 | size * Math.pow(rnd2, 2) + size/20;

                const bx = hw + Math.cos(angle) * r;
                const by = hh + Math.sin(angle) * r;

                const h = 0 | size/50 + size/4 * rnd * rnd * rnd;
                const span = h * (1 + Math.random())/(TAU * r);

                const count = 5;

                const hCount = count/2;

                const pts = [];
                const spanStep = span / count;
                const hStep = h/count;
                for (let y = 0; y < count; y++)
                {
                    for (let x = -hCount; x < hCount; x++)
                    {
                        if (Math.random() < 0.4)
                        {
                            const a2 = angle + spanStep * x;
                            const radius = r + y * hStep;

                            const x1 = bx + Math.cos(a2) * radius;
                            const y1 = by + Math.sin(a2) * radius;

                            // dull the edges
                            pts.push({
                                x: x1 + pad,
                                y: y1
                            }, {
                                x: x1 - pad,
                                y: y1
                            }, {
                                x : x1,
                                y: y1 + pad,
                            }, {
                                x : x1,
                                y: y1 - pad
                            })
                        }
                    }
                }

                ctx.fillStyle = colors();

                const hull = QuickHull(pts);

                ctx.beginPath();
                ctx.moveTo(hull[0].x, hull[0].y);
                for (let i = 1; i < hull.length; i++)
                {
                    const { x: x1, y: y1 } = hull[i];
                    ctx.lineTo(x1,y1);
                }
                ctx.fill();

            }

        }

        paint();

        window.addEventListener("click", paint, true)
    }
);
