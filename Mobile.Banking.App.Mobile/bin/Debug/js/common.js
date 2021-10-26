
var mainColor = '#d52133';
var negativeColor = '#f16f5c';
var mainFontFamily = 'Helvetica';

function maskTarjeta(Numero, LeftToRigth, RigthToLeft) {
    if (Numero == undefined || Numero == null)
        return undefined

    if (LeftToRigth == undefined || LeftToRigth == null || LeftToRigth < 0)
        return undefined

    if (RigthToLeft == undefined || RigthToLeft == null || RigthToLeft < 0)
        return undefined

    var mascara = '';
    if (Numero.length > 0) {
        var numRigthToLeft = Numero.length - RigthToLeft;
        for (var i = 0; i < Numero.length; i++) {
            if (i < LeftToRigth)
                mascara = mascara + Numero[i];
            else
                if (numRigthToLeft > 0 && i > numRigthToLeft)
                    mascara = mascara + Numero[i];
                else
                    mascara = mascara + 'X';
        }
    }
    return mascara;
}