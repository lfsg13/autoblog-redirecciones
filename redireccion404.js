(function() {
    // 1. Normalización (Quita tildes y mayúsculas)
    function normalizarTexto(texto) {
        if (!texto) return "";
        return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    // 2. MOTOR SEMÁNTICO: Algoritmo de Distancia de Levenshtein (Fuzzy Matching)
    // Calcula qué tan similares son dos palabras (retorna un valor de 0 a 1)
    function calcularSimilitud(s1, s2) {
        var longer = s1, shorter = s2;
        if (s1.length < s2.length) { longer = s2; shorter = s1; }
        var longerLength = longer.length;
        if (longerLength == 0) return 1.0;
        
        var costs = new Array();
        for (var i = 0; i <= longer.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= shorter.length; j++) {
                if (i == 0) costs[j] = j;
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (longer.charAt(i - 1) != shorter.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) costs[shorter.length] = lastValue;
        }
        return (longerLength - costs[shorter.length]) / parseFloat(longerLength);
    }

    // Limpiamos la URL rota cambiando guiones y barras por espacios
    var rutaSucia = window.location.pathname.replace(/[-/]/g, " ") + window.location.search.replace(/[-_]/g, " ");
    var rutaNormalizada = normalizarTexto(decodeURIComponent(rutaSucia));
    var palabrasRuta = rutaNormalizada.split(/\s+/); // Dividimos en palabras individuales

    var host = window.location.hostname;
    var urlDestino = "https://" + host + "/"; // Fallback al inicio

    // 3. TU DICCIONARIO LIMPIO (Solo palabras correctas)
    var enlaces = [
        { keywords: ["biologia", "composicion", "inteligencia"], url: "https://althox.blogspot.com/ejemplo-1.html" },
        { keywords: ["blockchain", "androides", "autonomos"], url: "https://althox.blogspot.com/ejemplo-2.html" },
        { keywords: ["chicken", "recipe"], url: "https://starpluto.blogspot.com/ejemplo-3.html" } // Ecosistema en inglés
    ];

    var urlEncontrada = "";

    // 4. LÓGICA DE BÚSQUEDA Y CORRECCIÓN ORTOGRÁFICA
    for (var i = 0; i < enlaces.length; i++) {
        var bloque = enlaces[i];
        
        for (var j = 0; j < bloque.keywords.length; j++) {
            var keyword = normalizarTexto(bloque.keywords[j]);
            
            // Comparamos cada palabra de la URL rota contra tus palabras clave
            for (var x = 0; x < palabrasRuta.length; x++) {
                var pRuta = palabrasRuta[x];
                if (pRuta.length <= 3) continue; // Ignoramos palabras muy cortas ("el", "de", "la")

                var similitud = calcularSimilitud(pRuta, keyword);
                
                // UMBRAL SEMÁNTICO: Si se parecen en un 80% o más, es un match.
                // (Ejemplo: "biolgia" vs "biologia" = 87% similitud)
                if (similitud >= 0.80) {
                    urlEncontrada = bloque.url;
                    break;
                }
            }
            if (urlEncontrada !== "") break;
        }
        if (urlEncontrada !== "") break;
    }

    if (urlEncontrada !== "") {
        window.location.replace(urlEncontrada);
    } else {
        window.location.replace(urlDestino);
    }
})();
