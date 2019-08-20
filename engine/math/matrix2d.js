define('engine/math/matrix2d', [

], function (

) {
    "use strict";
    var Matrix2D = {};

    var C00 = 0;
    var C10 = 1;
    var C20 = 2;

    var C01 = 3;
    var C11 = 4;
    var C21 = 5;

    var C02 = 6;
    var C12 = 7;
    var C22 = 8;

    Matrix2D.identity = function () {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
    };

    Matrix2D.reset = function (mat) {
        mat[0] = 1;
        mat[1] = 0;
        mat[2] = 0;

        mat[3] = 0;
        mat[4] = 1;
        mat[5] = 0;

        mat[6] = 0;
        mat[7] = 0;
        mat[8] = 1;
    };

    Matrix2D.clone = function (source) {
        return [].concat(source);
    };

    Matrix2D.multiply = function (matA, matB) {
        var dest = Matrix2D.identity();

        var xx;
        var yy;
        var zz;
        var sum;

        for (xx = 0; xx < 3; xx++) {
            for (yy = 0; yy < 3; yy++) {
                sum = 0;
                for (zz = 0; zz < 3; zz++) {
                    sum += matA[xx + zz * 3] * matB[zz + yy * 3];
                }
                dest[xx + yy * 3] = sum;
            }
        }

        return dest;
    };

    Matrix2D.translate = function (mat, x, y) {
        var trans = Matrix2D.identity();
        trans[C20] = x;
        trans[C21] = y;

        return Matrix2D.multiply(trans, mat);
    };

    Matrix2D.rotate = function (mat, angle) {
        if (angle === 0) {
            return mat;
        }
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);

        var rot = Matrix2D.identity();

        rot[C00] = cos;
        rot[C01] = sin;
        rot[C10] = -sin;
        rot[C11] = cos;

        return Matrix2D.multiply(rot, mat);
    };

    Matrix2D.rotateDegrees = function (mat, angle) {
        return Matrix2D.rotate(mat, angle * (Math.PI / 180));
    };

    Matrix2D.scale = function (mat, x, y) {
        var scale = Matrix2D.identity();

        scale[C00] = x;
        scale[C11] = y;

        return Matrix2D.multiply(scale, mat);
    };

    /*
     * Vectors
     */
    Matrix2D.multiplyVector = function (mat, vector) {
        //z is 0
        var x = mat[C00] * vector.x + mat[C01] * vector.x + mat[C02] * vector.x + mat[C20];
        var y = mat[C10] * vector.y + mat[C11] * vector.y + mat[C12] * vector.y + mat[C21];

        return { x: x, y: y };
    };

    Matrix2D.multiplyVectorDirect = function (mat, vector) {
        //z is 0
        vector.x = mat[C00] * vector.x + mat[C01] * vector.x + mat[C02] * vector.x;
        vector.y = mat[C10] * vector.y + mat[C11] * vector.y + mat[C12] * vector.y;

        return vector;
    };

    /*
     * Detrminant and inverse
     */
    Matrix2D.determinant = function (mat) {
        var sum = mat[C00] * mat[C11] * mat[C22];
        sum += mat[C10] * mat[C21] * mat[C02];
        sum += mat[C20] * mat[C01] * mat[C12];

        sum -= mat[C20] * mat[C11] * mat[C02];
        sum -= mat[C10] * mat[C01] * mat[C22];
        sum -= mat[C00] * mat[C21] * mat[C12];

        return sum;
    };

    Matrix2D.inverse = function (mat) {
        var det = Matrix2D.determinant(mat);
        if (det === 0) {
            //matrix is not invertable
            return Matrix2D.identity;
        }
        var factor = 1 / det;
        var result = Matrix2D.identity();

        result[C00] = factor * (mat[C22] * mat[C11] - mat[C12] * mat[C21]);
        result[C10] = factor * (mat[C12] * mat[C20] - mat[C22] * mat[C10]);
        result[C20] = factor * (mat[C21] * mat[C10] - mat[C11] * mat[C20]);

        result[C01] = factor * (mat[C02] * mat[C21] - mat[C22] * mat[C01]);
        result[C11] = factor * (mat[C22] * mat[C00] - mat[C02] * mat[C20]);
        result[C21] = factor * (mat[C01] * mat[C20] - mat[C21] * mat[C00]);

        result[C02] = factor * (mat[C12] * mat[C01] - mat[C02] * mat[C11]);
        result[C12] = factor * (mat[C02] * mat[C10] - mat[C12] * mat[C00]);
        result[C22] = factor * (mat[C11] * mat[C00] - mat[C01] * mat[C10]);

        return result;
    };



    return Matrix2D;
});