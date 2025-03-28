//+------------------------------------------------------------------+
//| ROBO BREAKOUT - Versão 1.0                                       |
//| Autor: Leonardo Henrique Vieira Barros                           |
//+------------------------------------------------------------------+
#property strict

//+------------------------------------------------------------------+
//| GESTÃO DE RISCO                                                   |
//+------------------------------------------------------------------+
input string    ___grisk____ = "=== GESTÃO DE RISCO ===";    //  GESTÃO DE RISCO
input double RiskPercent = 1.0;              // Risco por operação (% da conta)
input double LotSize = 0.01;                 // Lotes (se RiskPercent=0)
input int MagicNumber = 12345;               // Número mágico
input double RiskRewardRatio = 2.0;          // Razão Risco/Retorno desejada

//+------------------------------------------------------------------+
//| CONFIGURAÇÕES DE BREAKOUT                                         |
//+------------------------------------------------------------------+
input string    ___break____ = "=== CONFIGURAÇÕES DE BREAKOUT ===";     //  BREAKOUT
input int PeriodCandles = 10;                // Período para suporte e resistência
input int BreakoutConfirmationPips = 20;     // Confirmação de Breakout em Pips
input double MinVolatilityFactor = 1.5;      // Fator mínimo de volatilidade para breakout
input int FalseBreakoutPips = 10;            // Pips para detectar falso breakout
input int VolatilityPeriod = 20;             // Período para média de volatilidade
input int MinBreakoutSize = 50;              // Tamanho mínimo do breakout (em pontos)

//+------------------------------------------------------------------+
//| GESTÃO DE STOPS E ALVOS                                          |
//+------------------------------------------------------------------+
input string    ___stops____ = "=== GESTÃO DE STOPS E ALVOS ===";      //  STOPS E ALVOS
input bool UseATRStops = true;               // Usar ATR para definir stops
input double ATRMultiplier = 2.0;            // Multiplicador do ATR para stop loss
input double ATRTPMultiplier = 3.0;          // Multiplicador do ATR para take profit
input bool UseProgressiveTargets = true;      // Usar alvos progressivos
input double TargetLevel1Percent = 30;        // Percentual para primeiro alvo
input double TargetLevel2Percent = 30;        // Percentual para segundo alvo
input double TargetLevel3Percent = 40;        // Percentual para terceiro alvo
//+------------------------------------------------------------------+
//| GESTÃO PELO TEMPO                                                |
//+------------------------------------------------------------------+
input string    ___time________ = "=== GESTÃO PELO TEMPO ===";      //  GESTÃO PELO TEMPO
input ENUM_TIMEFRAMES HigherTimeframe = PERIOD_H4;  // Timeframe superior
input bool UseMultiTimeframe = true;          // Usar análise multi-timeframe
input int BBPeriod = 20;                      // Período das Bandas de Bollinger
input double BBDeviations = 2.0;              // Desvios das Bandas de Bollinger
input int KeltnerPeriod = 20;                 // Período do Canal de Keltner
input double KeltnerMultiplier = 1.5;         // Multiplicador do Keltner

//+------------------------------------------------------------------+
//| FILTROS DE TENDÊNCIA                                             |
//+------------------------------------------------------------------+
input string    ___trend____ = "=== FILTROS DE TENDÊNCIA ===";         //  FILTROS DE TENDÊNCIA
input bool UseEMAFilter = true;               // Usar filtro de médias móveis
input bool UseRSIFilter = true;               // Usar filtro de RSI
input int RSIPeriod = 14;                     // Período do RSI
input int RSIOverBought = 70;                 // Nível de sobrecompra
input int RSIOverSold = 30;                   // Nível de sobrevenda
input bool UseADXFilter = true;               // Usar filtro de ADX
input int ADXPeriod = 14;                     // Período do ADX
input int ADXThreshold = 25;                  // Limiar do ADX
input int ATRPeriod = 14;                    // Período do ATR
input double MinATR = 0.0010;                // ATR mínimo para operar

//+------------------------------------------------------------------+
//| TRAILING E BREAK EVEN                                             |
//+------------------------------------------------------------------+
input string    ___trail____ = "=== TRAILING E BREAK EVEN ===";        //  TRAILING E BREAK EVEN
input bool UseBreakEven = true;               // Usar break even
input double BEATRMultiplier = 1.0;           // Multiplicador ATR para break even
input int BreakEvenOffset = 500;              // Offset para break even
input bool UseTrailingStop = true;            // Usar trailing stop
input double TrailATRMultiplier = 1.5;        // Multiplicador ATR para trailing
input double TrailStep = 0.5;                 // Passo do trailing

//+------------------------------------------------------------------+
//| FILTROS DE TEMPO                                                  |
//+------------------------------------------------------------------+
input string    ___time_____ = "=== FILTROS DE TEMPO ===";             //  FILTROS DE TEMPO
input bool TradingTimeFilter = true;          // Filtro de horário
input int StartHour = 8;                      // Hora de início
input int EndHour = 17;                       // Hora de fim
input bool MondayFilter = true;               // Evitar segunda-feira
input bool FridayFilter = true;               // Evitar sexta-feira

//+------------------------------------------------------------------+
//| GESTÃO DE PERDAS                                                  |
//+------------------------------------------------------------------+
input string    ___loss_____ = "=== GESTÃO DE PERDAS ===";             //  GESTÃO DE PERDAS
input bool UsePauseAfterLoss = true;          // Pausa após perda
input int PauseMinutes = 120;                 // Minutos de pausa
input int MaxConsecutiveLosses = 3;           // Máximo de perdas consecutivas
input bool RequireRetracementAfterLoss = true; // Exigir retração após perda
input double RetracementPercent = 30.0;       // Porcentagem de retração

//+------------------------------------------------------------------+
//| AJUSTES DE VOLATILIDADE                                          |
//+------------------------------------------------------------------+
input string    ___vol______ = "=== AJUSTES DE VOLATILIDADE ===";      //  AJUSTES DE VOLATILIDADE
input bool AdjustForVolatility = true;        // Ajustar para volatilidade
input double VolatilityMultiplier = 0.8;      // Multiplicador de volatilidade
input int MaxSpreadPoints = 50;              // Spread máximo permitido em pontos
input bool UseVolatilityAdjustment = true;   // Ajustar posição pela volatilidade
input bool UseATR = true;                    // Usar ATR para análise



struct TradeLogStruct {
    datetime timeStamp;
    string actionType;
    string direction;
    double price;
    double stopLoss;
    double takeProfit;
    double lots;
    string reason;
};

TradeLogStruct tradeLogs[];

//--- Variáveis Globais
double ResistanceLevel, SupportLevel, MidLevel;
double Fib382Level, Fib618Level;
double PointValue;
int lastTimeFrame = 0;
double tickValue;
datetime lastLossTime = 0;
datetime lastLevelCalculationTime = 0;
int consecutiveLosses = 0;
bool lastBuyProfitable = true;
bool lastSellProfitable = true;
bool retracementAfterBuyLoss = true;
bool retracementAfterSellLoss = true;
int lastBuyTicket = 0;
int lastSellTicket = 0;
datetime lastOrderCloseTime = 0;
double lastBuyPrice = 0;
double lastSellPrice = 0;
int DigitsMinimum;
double lastTickVolumes[];


//--- Estrutura para logging
struct TradeLog {
    datetime timeStamp;
    string actionType;
    string direction;
    double price;
    double stopLoss;
    double takeProfit;
    double lots;
    string reason;
    double lastTickVolumes[];  // Array para armazenar volumes históricos
};



//+------------------------------------------------------------------+
//| Função para logging avançado                                      |
//+------------------------------------------------------------------+
void LogTradeAction(string actionType, string direction, double price, 
                    double stopLoss, double takeProfit, double lots, string reason)
{
    int size = ArraySize(tradeLogs);
    ArrayResize(tradeLogs, size + 1);
    
    tradeLogs[size].timeStamp = TimeCurrent();
    tradeLogs[size].actionType = actionType;
    tradeLogs[size].direction = direction;
    tradeLogs[size].price = price;
    tradeLogs[size].stopLoss = stopLoss;
    tradeLogs[size].takeProfit = takeProfit;
    tradeLogs[size].lots = lots;
    tradeLogs[size].reason = reason;
    
    string fileName = "TradeLog_" + Symbol() + "_" + IntegerToString(Year()) + ".csv";
    int fileHandle = FileOpen(fileName, FILE_WRITE|FILE_CSV|FILE_ANSI);
    
    if(fileHandle != INVALID_HANDLE)
    {
        FileWrite(fileHandle, 
                 TimeToString(tradeLogs[size].timeStamp),
                 tradeLogs[size].actionType,
                 tradeLogs[size].direction,
                 DoubleToString(tradeLogs[size].price, Digits),
                 DoubleToString(tradeLogs[size].stopLoss, Digits),
                 DoubleToString(tradeLogs[size].takeProfit, Digits),
                 DoubleToString(tradeLogs[size].lots, 2),
                 tradeLogs[size].reason);
        FileClose(fileHandle);
    }
    
    Print("[LOG] ", actionType, " ", direction, " @ ", price, " SL:", stopLoss, " TP:", takeProfit);
}

//+------------------------------------------------------------------+
//| Função para verificar pausa após perda                           |
//+------------------------------------------------------------------+
bool IsInPauseAfterLoss()
{
    if(!UsePauseAfterLoss || lastLossTime == 0) 
        return false;
        
    if(TimeCurrent() - lastLossTime < PauseMinutes * 60)
    {
        int minutesLeft = (int)((PauseMinutes * 60) - (TimeCurrent() - lastLossTime)) / 60;
        Print("[PAUSA] EA em pausa após perda. Faltam ", minutesLeft, " minutos");
        return true;
    }
    
    return false;
}

//+------------------------------------------------------------------+
//| Função para verificar entrada em compra                          |
//+------------------------------------------------------------------+
bool CanEnterBuy()
{
    if(consecutiveLosses >= MaxConsecutiveLosses)
    {
        Print("[ALERTA] Máximo de perdas consecutivas atingido");
        return false;
    }
    
    if(!retracementAfterBuyLoss)
    {
        Print("[ALERTA] Aguardando retração após perda em compra");
        return false;
    }
    
    return true;
}

//+------------------------------------------------------------------+
//| Função para verificar entrada em venda                           |
//+------------------------------------------------------------------+
bool CanEnterSell()
{
    if(consecutiveLosses >= MaxConsecutiveLosses)
    {
        Print("[ALERTA] Máximo de perdas consecutivas atingido");
        return false;
    }
    
    if(!retracementAfterSellLoss)
    {
        Print("[ALERTA] Aguardando retração após perda em venda");
        return false;
    }
    
    return true;
}

//+------------------------------------------------------------------+
//| Função para calcular tamanho do lote                             |
//+------------------------------------------------------------------+
double CalculateLotSize(double stopPoints)
{
    if(RiskPercent <= 0) return LotSize;
    
    double balance = AccountBalance();
    double tickSize = MarketInfo(Symbol(), MODE_TICKSIZE);
    // Aqui usamos a variável global ao invés de criar uma nova
    tickValue = MarketInfo(Symbol(), MODE_TICKVALUE);
    double risk = balance * RiskPercent / 100;
    double lotStep = MarketInfo(Symbol(), MODE_LOTSTEP);
    double minLot = MarketInfo(Symbol(), MODE_MINLOT);
    double maxLot = MarketInfo(Symbol(), MODE_MAXLOT);
    
    double calculatedLot = NormalizeDouble(risk / (stopPoints * tickValue / tickSize), 2);
    
    if(UseVolatilityAdjustment)
    {
        double atr = iATR(Symbol(), 0, ATRPeriod, 0);
        double normalATR = 0.0015;
        
        if(atr > normalATR)
        {
            double ratio = normalATR / atr;
            calculatedLot = calculatedLot * MathMin(1.0, ratio * VolatilityMultiplier);
        }
    }
    
    calculatedLot = MathFloor(calculatedLot / lotStep) * lotStep;
    
    if(calculatedLot < minLot) calculatedLot = minLot;
    if(calculatedLot > maxLot) calculatedLot = maxLot;
    
    return calculatedLot;
}
//+------------------------------------------------------------------+
//| Função para detectar squeeze                                      |
//+------------------------------------------------------------------+
bool IsSqueezeForming()
{
    double bb_upper, bb_lower, kc_upper, kc_lower;
    
    bb_upper = iBands(Symbol(), 0, BBPeriod, BBDeviations, 0, PRICE_CLOSE, MODE_UPPER, 0);
    bb_lower = iBands(Symbol(), 0, BBPeriod, BBDeviations, 0, PRICE_CLOSE, MODE_LOWER, 0);
    
    double atr = iATR(Symbol(), 0, KeltnerPeriod, 0);
    double ma = iMA(Symbol(), 0, KeltnerPeriod, 0, MODE_SMA, PRICE_CLOSE, 0);
    kc_upper = ma + (atr * KeltnerMultiplier);
    kc_lower = ma - (atr * KeltnerMultiplier);
    
    bool squeeze = (bb_upper < kc_upper) && (bb_lower > kc_lower);
    
    if(squeeze)
        Print("[SQUEEZE] Detectada compressão de volatilidade");
        
    return squeeze;
}

//+------------------------------------------------------------------+
//| Função para verificar divergência                                 |
//+------------------------------------------------------------------+
bool CheckDivergence(bool isBuy)
{
    int lookback = 5;
    double currentPrice = iClose(NULL, 0, 0);
    double previousPrice = iClose(NULL, 0, lookback);
    
    double currentRSI = iRSI(NULL, 0, RSIPeriod, PRICE_CLOSE, 0);
    double previousRSI = iRSI(NULL, 0, RSIPeriod, PRICE_CLOSE, lookback);
    
    bool bullishDivergence = (currentPrice < previousPrice) && (currentRSI > previousRSI);
    bool bearishDivergence = (currentPrice > previousPrice) && (currentRSI < previousRSI);
    
    if(isBuy && bearishDivergence)
    {
        Print("[DIVERGÊNCIA] Detectada divergência de baixa");
        return true;
    }
    
    if(!isBuy && bullishDivergence)
    {
        Print("[DIVERGÊNCIA] Detectada divergência de alta");
        return true;
    }
    
    return false;
}


//+------------------------------------------------------------------+
//| Função para detectar falsos breakouts                            |
//+------------------------------------------------------------------+
bool IsFalseBreakout(bool isBuy, double entryPrice)
{
    for(int i = 1; i <= 3; i++)
    {
        if(isBuy)
        {
            if(iLow(Symbol(), 0, i) < entryPrice - (FalseBreakoutPips * _Point))
            {
                Print("[FALSO BREAKOUT] Detectada falha no breakout de alta");
                return true;
            }
        }
        else
        {
            if(iHigh(Symbol(), 0, i) > entryPrice + (FalseBreakoutPips * _Point))
            {
                Print("[FALSO BREAKOUT] Detectada falha no breakout de baixa");
                return true;
            }
        }
    }
    return false;
}


//+------------------------------------------------------------------+
//| Função para verificar tendência em timeframe superior             |
//+------------------------------------------------------------------+
bool CheckHigherTimeframe(bool isBuy)
{
    if(!UseMultiTimeframe) return true;
    
    double ema20 = iMA(Symbol(), HigherTimeframe, 20, 0, MODE_EMA, PRICE_CLOSE, 0);
    double ema50 = iMA(Symbol(), HigherTimeframe, 50, 0, MODE_EMA, PRICE_CLOSE, 0);
    double ema200 = iMA(Symbol(), HigherTimeframe, 200, 0, MODE_EMA, PRICE_CLOSE, 0);
    double currentPrice = iClose(Symbol(), HigherTimeframe, 0);
    
    if(isBuy)
    {
        bool trendUp = (currentPrice > ema20) && (ema20 > ema50) && (ema50 > ema200);
        if(!trendUp) Print("[TIMEFRAME] Tendência de alta não confirmada no timeframe superior");
        return trendUp;
    }
    else
    {
        bool trendDown = (currentPrice < ema20) && (ema20 < ema50) && (ema50 < ema200);
        if(!trendDown) Print("[TIMEFRAME] Tendência de baixa não confirmada no timeframe superior");
        return trendDown;
    }
}

//+------------------------------------------------------------------+
//| Função para verificar padrões de velas                           |
//+------------------------------------------------------------------+
bool CheckCandlePattern(bool isBuy)
{
    double open1 = iOpen(Symbol(), 0, 1);
    double close1 = iClose(Symbol(), 0, 1);
    double high1 = iHigh(Symbol(), 0, 1);
    double low1 = iLow(Symbol(), 0, 1);
    
    double open2 = iOpen(Symbol(), 0, 2);
    double close2 = iClose(Symbol(), 0, 2);
    
    double bodySize1 = MathAbs(open1 - close1);
    double upperWick1 = high1 - MathMax(open1, close1);
    double lowerWick1 = MathMin(open1, close1) - low1;
    
    if(isBuy)
    {
        // Padrão de engolfo de alta
        bool bullishEngulfing = (close1 > open1) &&           // Vela de alta
                               (close2 < open2) &&           // Vela anterior de baixa
                               (close1 > open2) &&           // Fecha acima da abertura anterior
                               (open1 < close2);             // Abre abaixo do fechamento anterior
                               
        // Pin bar de alta
        bool bullishPinBar = (lowerWick1 > bodySize1 * 2) && // Sombra inferior grande
                            (upperWick1 < bodySize1 * 0.5);   // Sombra superior pequena
                            
        if(bullishEngulfing || bullishPinBar)
        {
            Print("[PADRÃO] Padrão de alta detectado");
            return true;
        }
    }
    else
    {
        // Padrão de engolfo de baixa
        bool bearishEngulfing = (close1 < open1) &&           // Vela de baixa
                               (close2 > open2) &&           // Vela anterior de alta
                               (close1 < open2) &&           // Fecha abaixo da abertura anterior
                               (open1 > close2);             // Abre acima do fechamento anterior
                               
        // Pin bar de baixa
        bool bearishPinBar = (upperWick1 > bodySize1 * 2) && // Sombra superior grande
                            (lowerWick1 < bodySize1 * 0.5);   // Sombra inferior pequena
                            
        if(bearishEngulfing || bearishPinBar)
        {
            Print("[PADRÃO] Padrão de baixa detectado");
            return true;
        }
    }
    
    return false;
}

//+------------------------------------------------------------------+
//| Função para cálculo dinâmico de stops                            |
//+------------------------------------------------------------------+
void CalculateDynamicStops(bool isBuy, double entryPrice, 
                          double& stopLoss, double& takeProfit[], double& lots[])
{
    double atr = iATR(Symbol(), 0, ATRPeriod, 0);
    
    // Cálculo do Stop Loss baseado em ATR
    double stopDistance = atr * ATRMultiplier;
    stopLoss = isBuy ? entryPrice - stopDistance : entryPrice + stopDistance;
    
    // Ajuste de risco baseado em volatilidade
    double riskAmount = AccountBalance() * (RiskPercent / 100);
    if(UseVolatilityAdjustment)
    {
        double normalATR = 0.0015;
        double volatilityRatio = atr / normalATR;
        riskAmount = riskAmount / MathMax(volatilityRatio, 1);
    }
    
    // Cálculo dos Take Profits progressivos
    ArrayResize(takeProfit, 3);
    ArrayResize(lots, 3);
    
    double totalLot = CalculateLotSize(MathAbs(entryPrice - stopLoss) / _Point);
    
    if(UseProgressiveTargets)
    {
        lots[0] = NormalizeDouble(totalLot * TargetLevel1Percent / 100, 2);
        lots[1] = NormalizeDouble(totalLot * TargetLevel2Percent / 100, 2);
        lots[2] = NormalizeDouble(totalLot * TargetLevel3Percent / 100, 2);
        
        double tp1Distance = stopDistance * RiskRewardRatio;
        double tp2Distance = stopDistance * RiskRewardRatio * 1.5;
        double tp3Distance = stopDistance * RiskRewardRatio * 2;
        
        if(isBuy)
        {
            takeProfit[0] = entryPrice + tp1Distance;
            takeProfit[1] = entryPrice + tp2Distance;
            takeProfit[2] = entryPrice + tp3Distance;
        }
        else
        {
            takeProfit[0] = entryPrice - tp1Distance;
            takeProfit[1] = entryPrice - tp2Distance;
            takeProfit[2] = entryPrice - tp3Distance;
        }
    }
    else
    {
        lots[0] = totalLot;
        takeProfit[0] = isBuy ? entryPrice + (stopDistance * RiskRewardRatio)
                             : entryPrice - (stopDistance * RiskRewardRatio);
    }
}

//+------------------------------------------------------------------+
//| Função para verificar horário de negociação                      |
//+------------------------------------------------------------------+
bool IsTradeTime()
{
    if(!TradingTimeFilter) return true;
    
    datetime currentTime = TimeCurrent();
    int currentDayOfWeek = TimeDayOfWeek(currentTime);
    int currentHour = TimeHour(currentTime);
    
    // Filtros de dia da semana
    if(MondayFilter && currentDayOfWeek == 1 && currentHour < StartHour)
    {
        Print("[TEMPO] Negociação não permitida no início de segunda-feira");
        return false;
    }
    
    if(FridayFilter && currentDayOfWeek == 5 && currentHour >= EndHour)
    {
        Print("[TEMPO] Negociação não permitida no fim de sexta-feira");
        return false;
    }
    
    // Filtro de horário
    if(currentHour >= StartHour && currentHour < EndHour)
        return true;
        
    Print("[TEMPO] Fora do horário de negociação permitido");
    return false;
}

//+------------------------------------------------------------------+
//| Função para verificar spread                                      |
//+------------------------------------------------------------------+
bool IsSpreadOK()
{
    double currentSpread = MarketInfo(Symbol(), MODE_SPREAD) * Point;
    double maxSpreadAllowed = MaxSpreadPoints * Point;
    
    if(currentSpread > maxSpreadAllowed)
    {
        Print("[SPREAD] Spread atual (", currentSpread, ") maior que permitido (", maxSpreadAllowed, ")");
        return false;
    }
    
    return true;
}

//+------------------------------------------------------------------+
//| Função para calcular níveis de suporte e resistência             |
//+------------------------------------------------------------------+
void CalculateLevels()
{
    double highestHigh = 0;
    double lowestLow = 999999;
    
    // Encontrar máxima e mínima do período
    for(int i = 1; i <= PeriodCandles; i++)
    {
        double high = iHigh(Symbol(), 0, i);
        double low = iLow(Symbol(), 0, i);
        
        if(high > highestHigh) highestHigh = high;
        if(low < lowestLow) lowestLow = low;
    }
    
    ResistanceLevel = highestHigh;
    SupportLevel = lowestLow;
    MidLevel = (ResistanceLevel + SupportLevel) / 2;
    
    // Calcular níveis de Fibonacci
    double range = ResistanceLevel - SupportLevel;
    Fib382Level = SupportLevel + (range * 0.382);
    Fib618Level = SupportLevel + (range * 0.618);
    
    // Atualizar linhas visuais
    UpdateChartObjects();
    
    Print("[NÍVEIS] Resistência: ", ResistanceLevel, " Suporte: ", SupportLevel);
    lastLevelCalculationTime = TimeCurrent();
}

//+------------------------------------------------------------------+
//| Função para atualizar objetos visuais no gráfico                 |
//+------------------------------------------------------------------+
void UpdateChartObjects()
{
    // Resistência
    CreateOrUpdateLine("ResistanceLine", ResistanceLevel, clrRed);
    
    // Suporte
    CreateOrUpdateLine("SupportLine", SupportLevel, clrGreen);
    
    // Linha média
    CreateOrUpdateLine("MidLine", MidLevel, clrWhite);
    
    // Níveis de Fibonacci
    CreateOrUpdateLine("Fib382Line", Fib382Level, clrOrange);
    CreateOrUpdateLine("Fib618Line", Fib618Level, clrOrange);
    
    // Adicionar texto com ATR
    if(UseATR)
    {
        double atr = iATR(Symbol(), 0, ATRPeriod, 0);
        string atrText = "ATR(" + IntegerToString(ATRPeriod) + "): " + DoubleToString(atr, 5);
        CreateOrUpdateLabel("ATRLabel", atrText, 10, 20, clrYellow);
    }
}

//+------------------------------------------------------------------+
//| Função auxiliar para criar ou atualizar linhas                   |
//+------------------------------------------------------------------+
void CreateOrUpdateLine(string name, double price, color lineColor)
{
    if(ObjectFind(name) == -1)
    {
        ObjectCreate(0, name, OBJ_HLINE, 0, 0, price);
        ObjectSetInteger(0, name, OBJPROP_COLOR, lineColor);
        ObjectSetInteger(0, name, OBJPROP_WIDTH, 1);
        ObjectSetInteger(0, name, OBJPROP_STYLE, STYLE_SOLID);
    }
    else
    {
        ObjectMove(name, 0, 0, price);
    }
}

//+------------------------------------------------------------------+
//| Função auxiliar para criar ou atualizar labels                   |
//+------------------------------------------------------------------+
void CreateOrUpdateLabel(string name, string text, int x, int y, color textColor)
{
    if(ObjectFind(name) == -1)
    {
        ObjectCreate(name, OBJ_LABEL, 0, 0, 0);
        ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_RIGHT_UPPER);
        ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
        ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
    }
    
    ObjectSetText(name, text, 8, "Arial", textColor);
}


//+------------------------------------------------------------------+
//| Função para gerenciar trailing stop                              |
//+------------------------------------------------------------------+
void ManageTrailingStop()
{
    if(!UseTrailingStop) return;
    
    double atr = iATR(Symbol(), 0, ATRPeriod, 0);
    
    for(int i = 0; i < OrdersTotal(); i++)
    {
        if(OrderSelect(i, SELECT_BY_POS, MODE_TRADES))
        {
            if(OrderMagicNumber() == MagicNumber && OrderSymbol() == Symbol())
            {
                double currentPrice = MarketInfo(OrderSymbol(), MODE_BID);
                double trailDistance = atr * TrailATRMultiplier;
                double trailStep = atr * TrailStep;
                
                if(OrderType() == OP_BUY)
                {
                    double newStop = currentPrice - trailDistance;
                    if(newStop > OrderStopLoss() + trailStep)
                    {
                        bool modified = OrderModify(OrderTicket(), OrderOpenPrice(), 
                                                  newStop, OrderTakeProfit(), 0, clrBlue);
                        if(modified)
                            Print("[TRAILING] Stop atualizado para Buy #", OrderTicket(), 
                                  " Novo stop: ", newStop);
                    }
                }
                else if(OrderType() == OP_SELL)
                {
                    double newStop = currentPrice + trailDistance;
                    if(newStop < OrderStopLoss() - trailStep || OrderStopLoss() == 0)
                    {
                        bool modified = OrderModify(OrderTicket(), OrderOpenPrice(), 
                                                  newStop, OrderTakeProfit(), 0, clrRed);
                        if(modified)
                            Print("[TRAILING] Stop atualizado para Sell #", OrderTicket(), 
                                  " Novo stop: ", newStop);
                    }
                }
            }
        }
    }
}

//+------------------------------------------------------------------+
//| Função para gerenciar break even                                 |
//+------------------------------------------------------------------+
void ManageBreakEven()
{
    if(!UseBreakEven) return;
    
    double atr = iATR(Symbol(), 0, ATRPeriod, 0);
    double beDistance = atr * BEATRMultiplier;
    
    for(int i = 0; i < OrdersTotal(); i++)
    {
        if(OrderSelect(i, SELECT_BY_POS, MODE_TRADES))
        {
            if(OrderMagicNumber() == MagicNumber && OrderSymbol() == Symbol())
            {
                double currentPrice = MarketInfo(OrderSymbol(), MODE_BID);
                
                if(OrderType() == OP_BUY)
                {
                    if(currentPrice >= OrderOpenPrice() + beDistance)
                    {
                        double newStop = OrderOpenPrice() + (BreakEvenOffset * Point);
                        if(newStop > OrderStopLoss())
                        {
                            bool modified = OrderModify(OrderTicket(), OrderOpenPrice(), 
                                                      newStop, OrderTakeProfit(), 0, clrBlue);
                            if(modified)
                                Print("[BREAK-EVEN] Stop movido para break-even em Buy #", 
                                      OrderTicket());
                        }
                    }
                }
                else if(OrderType() == OP_SELL)
                {
                    if(currentPrice <= OrderOpenPrice() - beDistance)
                    {
                        double newStop = OrderOpenPrice() - (BreakEvenOffset * Point);
                        if(newStop < OrderStopLoss() || OrderStopLoss() == 0)
                        {
                            bool modified = OrderModify(OrderTicket(), OrderOpenPrice(), 
                                                      newStop, OrderTakeProfit(), 0, clrRed);
                            if(modified)
                                Print("[BREAK-EVEN] Stop movido para break-even em Sell #", 
                                      OrderTicket());
                        }
                    }
                }
            }
        }
    }
}

//+------------------------------------------------------------------+
//| Função para validar breakout                                      |
//+------------------------------------------------------------------+
bool IsValidBreakout(bool isBuy)
{    
    // Verificar spread
    double spread = MarketInfo(Symbol(), MODE_SPREAD);
    if(spread > 30000)  // Ajuste conforme seu ativo
    {
        Print("[BREAKOUT] Spread muito alto");
        return false;
    }
    
    // Verificar confirmação de preço
    double confirmationLevel = isBuy ? ResistanceLevel + (BreakoutConfirmationPips * Point) 
                                   : SupportLevel - (BreakoutConfirmationPips * Point);
    
    double currentPrice = Close[0];
    if(isBuy && currentPrice < confirmationLevel)
    {
        Print("[BREAKOUT] Preço não confirmou breakout de alta");
        return false;
    }
    else if(!isBuy && currentPrice > confirmationLevel)
    {
        Print("[BREAKOUT] Preço não confirmou breakout de baixa");
        return false;
    }
    
    // Verificar timeframe superior
    if(!CheckHigherTimeframe(isBuy))
        return false;
    
    // Verificar padrões de velas
    if(!CheckCandlePattern(isBuy))
        return false;
    
    // Verificar falso breakout
    if(IsFalseBreakout(isBuy, currentPrice))
        return false;
    
    return true;
}



//+------------------------------------------------------------------+
//| Expert initialization function                                    |
//+------------------------------------------------------------------+
int OnInit()
{
    // Verificar período mínimo necessário
    if(Bars < 100)
    {
        Print("Erro: Histórico insuficiente para análise!");
        return INIT_FAILED;
    }
    
    // Inicializar variáveis
    PointValue = MarketInfo(Symbol(), MODE_POINT);
    tickValue = MarketInfo(Symbol(), MODE_TICKVALUE);
    
    // Calcular níveis iniciais
    CalculateLevels();
    
    // Configurar precisão dos logs
    DigitsMinimum = (int)MarketInfo(Symbol(), MODE_DIGITS);
    

        
    Print("EA Breakout iniciado com sucesso!");
    return INIT_SUCCEEDED;
}

//+------------------------------------------------------------------+
//| Expert deinitialization function                                  |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
    // Limpar objetos do gráfico
    ObjectsDeleteAll(0, OBJ_HLINE);
    ObjectsDeleteAll(0, OBJ_LABEL);
    
    Print("EA Breakout finalizado. Razão: ", reason);
}

//+------------------------------------------------------------------+
//| Expert tick function                                              |
//+------------------------------------------------------------------+
void OnTick()
{
    // Verificar se é uma nova vela
    static datetime lastBar;
    datetime currentBar = iTime(Symbol(), 0, 0);
    bool isNewBar = (lastBar != currentBar);
    lastBar = currentBar;
    
    // Atualizar níveis se necessário
    if(TimeCurrent() - lastLevelCalculationTime > PeriodCandles * PeriodSeconds())
    {
        CalculateLevels();
    }
    
    // Gerenciar ordens existentes
    ManageTrailingStop();
    ManageBreakEven();
    
    // Se não é uma nova vela, apenas gerenciar posições existentes
    if(!isNewBar) return;
    
    // Verificar condições básicas
    if(!IsTradeTime() || !IsSpreadOK())
        return;
        
    // Verificar se já temos posições abertas
    if(OrdersTotal() > 0)
    {
        for(int i = 0; i < OrdersTotal(); i++)
        {
            if(OrderSelect(i, SELECT_BY_POS, MODE_TRADES))
            {
                if(OrderMagicNumber() == MagicNumber && OrderSymbol() == Symbol())
                    return; // Já temos uma posição aberta
            }
        }
    }
    
    // Verificar pausa após perda
    if(IsInPauseAfterLoss())
        return;
    
    double currentPrice = Close[0];
    
    // Verificar breakout de alta
    if(currentPrice > ResistanceLevel && CanEnterBuy())
    {
        if(IsValidBreakout(true))
        {
            double stopLoss, takeProfit[];
            double lots[];
            
            CalculateDynamicStops(true, currentPrice, stopLoss, takeProfit, lots);
            
            // Abrir posições com múltiplos alvos
            for(int i = 0; i < ArraySize(lots); i++)
            {
                if(lots[i] > 0)
                {
                    int ticket = OrderSend(Symbol(), OP_BUY, lots[i], currentPrice, 3, 
                                         stopLoss, takeProfit[i], "Breakout Buy", 
                                         MagicNumber, 0, clrGreen);
                                         
                    if(ticket > 0)
                    {
                        LogTradeAction("OPEN", "BUY", currentPrice, stopLoss, 
                                     takeProfit[i], lots[i], "Breakout confirmado");
                    }
                }
            }
        }
    }
    
    // Verificar breakout de baixa
    else if(currentPrice < SupportLevel && CanEnterSell())
    {
        if(IsValidBreakout(false))
        {
            double stopLoss, takeProfit[];
            double lots[];
            
            CalculateDynamicStops(false, currentPrice, stopLoss, takeProfit, lots);
            
            // Abrir posições com múltiplos alvos
            for(int i = 0; i < ArraySize(lots); i++)
            {
                if(lots[i] > 0)
                {
                    int ticket = OrderSend(Symbol(), OP_SELL, lots[i], currentPrice, 3, 
                                         stopLoss, takeProfit[i], "Breakout Sell", 
                                         MagicNumber, 0, clrRed);
                                         
                    if(ticket > 0)
                    {
                        LogTradeAction("OPEN", "SELL", currentPrice, stopLoss, 
                                     takeProfit[i], lots[i], "Breakout confirmado");
                    }
                }
            }
        }
    }
}

//+------------------------------------------------------------------+
//| Custom function to check if we can trade                         |
//+------------------------------------------------------------------+
bool CanTrade()
{
    if(!IsTradeTime()) return false;
    if(!IsSpreadOK()) return false;
    if(IsInPauseAfterLoss()) return false;
    if(consecutiveLosses >= MaxConsecutiveLosses)
    {
        Print("[ALERTA] Máximo de perdas consecutivas atingido");
        return false;
    }
    
    return true;
}

//+------------------------------------------------------------------+
//| Expert helper function to format doubles                         |
//+------------------------------------------------------------------+
string FormatDouble(double value, int digits)
{
    return DoubleToString(value, digits);
}
