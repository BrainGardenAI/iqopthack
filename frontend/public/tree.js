

function rotate(vector, angle) {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    }
}
function scale(vector, a) {
    return {
        x: vector.x * a,
        y: vector.y * a
    }
}
function sum(v1, v2) {
    return {
        x: v1.x + v2.x,
        y: v1.y + v2.y
    }
}
function minus(v1, v2) {
    return {
        x: v1.x - v2.x,
        y: v1.y - v2.y
    }
}

function length(vector) {
    return Math.sqrt( vector.x * vector.x + vector.y * vector.y );
}

window.tree = {
    canvas: '',
    ctx: '',
    angle: Math.PI / 10,
    scale_factor: 0.9,

    angleRandomVal: 0,
    angleRandom: function() {
        return this.angleRandomVal;// + Math.random() * 0.03
    },

    COLOR_G1: '#EB4C2C',
    COLOR_G2: '#EB953A',
    COLOR_G3: '#D1CD4D',
    COLOR_G4: '#7EAA3C',
    COLOR_G5: '#487830',

    COLOR_LEAF1: '#558B6E',
    COLOR_LEAF2: '#9CD08F',
    COLOR_LEAF3: '#ECFEAA',
    COLOR_CIRCLE: '#DCF9DD',
    COLOR_STAND: '#7BA36F',
    COLOR_LEAVES: ['#558B6E', '#9CD08F', '#ECFEAA'],
    COLOR_BRANCH: '#515751',

    drawTree: function (start, root, depth) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = '#0x000000';


        this.ctx.lineWidth = 1;
        start = minus(start, {x:0, y:200})
        this.ctx.beginPath();
        this.ctx.fillStyle = this.COLOR_CIRCLE;
        this.ctx.arc(start.x, start.y - 160, 250, 0, Math.PI * 2, true);
        this.ctx.closePath();
        // this.ctx.stroke();
        this.ctx.fill();

        var r_width = 200;
        var r_height = 0.5;
        this.ctx.fillStyle = "black"
        this.ctx.fillRect(
            start.x - r_width / 2, start.y, r_width, r_height
        )

        this.startDepth = depth;
        this.drawBranches(start, root, depth, 0);
    },
    startDepth: 10,
    maxBranches: Math.pow(2, this.startDepth),
    currentBranches: 0,

    drawBranches: function (start, root, depth, code) {
        if(depth === 0)
            return;
        // root = scale(root, 0.1 + 0.1 * code % 5);

        this.drawBranch(start, root, depth, code | 1 << depth);
        var end = minus(start, root);

        //draw left
        var scaleFactor = Math.pow(this.scale_factor, depth * 0.2);
        var left = rotate(scale(root, scaleFactor), -this.angle + this.angleRandom());
        this.drawBranches(end, left, depth - 1, code | 1 << depth);
        //draw right
        var right = rotate(scale(root, scaleFactor), this.angle + this.angleRandom());
        this.drawBranches(end, right, depth - 1, code );
    },

    drawBranch: function(start, root, depth, code, subBranch) {

        var alpha = -Math.atan2(root.x, root.y);

        var l = length(root);

        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.translate(start.x, start.y);
        this.ctx.rotate(alpha);

        var trapeziBot = 8 * (depth / this.startDepth);
        var trapeziTop = 6 * (depth / this.startDepth);

        var grad = this.ctx.createLinearGradient(-trapeziBot/2, -l/2, trapeziBot/2, -l/2);
        grad.addColorStop(0,"white");
        grad.addColorStop(1,this.COLOR_BRANCH);
        this.ctx.fillStyle = grad;

        this.ctx.moveTo( - trapeziBot / 2, 0);
        this.ctx.lineTo(   trapeziBot / 2, 0);

        this.ctx.lineTo(   trapeziTop / 2, -l);
        this.ctx.lineTo( - trapeziTop / 2, -l);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();

            //draw additional sub-branch
        if (!subBranch && (this.startDepth - depth) > 2) {
            var subBranchLeft = rotate(scale(root, 0.6), this.angle * 2);
            this.drawBranch(minus(start, scale(root, 0.6)), subBranchLeft, 1, code, true);
        }
        if (!subBranch && (this.startDepth - depth) > 2) {
            var subBranchRight = rotate(scale(root, 0.3), -this.angle * 2);
            this.drawBranch(minus(start, scale(root, 0.3)), subBranchRight, 1, code, true);
        }

        if(depth === 1) {
            var end = minus(start, root);
            this.drawLeaf(end, root, code);
        }
    },

    drawLeaf: function(start, root, code) {
        var l = 10;
        var alpha = -Math.atan2(root.x, root.y) + this.angleRandom() + Math.random() * 0.2;
        this.ctx.save();
        this.ctx.translate(start.x, start.y);
        this.ctx.rotate(alpha);

        var cc = this.COLOR_LEAVES[code % this.COLOR_LEAVES.length];
        var grad = this.ctx.createRadialGradient(0, -l/3, 2*l, 0, -l/3, l);
        grad.addColorStop(0, "white");
        grad.addColorStop(1, cc);
        this.ctx.fillStyle = grad;

        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.lineTo(l/4, -l/10);
        this.ctx.lineTo(l/3, -l/3);
        this.ctx.lineTo(l/4, -l/2);
        this.ctx.lineTo(l/6, -l*2/3);
        this.ctx.lineTo(0,   -l);
        this.ctx.lineTo(-l/6, -l*2/3);
        this.ctx.lineTo(-l/4, -l/2);
        this.ctx.lineTo(-l/3, -l/3);
        this.ctx.lineTo(-l/4, -l/10);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.restore();
    },

    dropMoney: function(start) {
        var coin = new Image();
        coin.src = 'http://i.imgur.com/5ZW2MT3.png';
        coin.onload = function () {
            element.appendChild(canvas)
            focused = true;
            drawloop();
        }
    },
    fallLoop: function () {
        if (focused) {
            requestAnimationFrame(drawloop);
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (Math.random() < .3) {
            coins.push({
                x: Math.random() * canvas.width | 0,
                y: -50,
                dy: 3,
                s: 0.5 + Math.random(),
                state: Math.random() * 10 | 0
            })
        }
        var i = coins.length
        while (i--) {
            var x = coins[i].x
            var y = coins[i].y
            var s = coins[i].s
            var state = coins[i].state
            coins[i].state = (state > 9) ? 0 : state + 0.1
            coins[i].dy += 0.3
            coins[i].y += coins[i].dy

            ctx.drawImage(coin, 44 * Math.floor(state), 0, 44, 40, x, y, 44 * s, 40 * s)

            if (y > canvas.height) {
                coins.splice(i, 1);
            }
        }
    }
};

