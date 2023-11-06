interface InfluencerEvaluatedStats {
    [key: string]: number;
}
export const evaluateStat = (stat: InfluencerEvaluatedStats) => {
    const statName = Object.keys(stat)[0];
    const statValue = stat[statName];
    // console.log('statName', statName);
    // console.log('statValue', statValue);
    //the cutoff standard can be find in KiteMaker ticket V2-1063
    switch (statName) {
        case 'engagementRateRaw':
            return statValue <= 0.005 ? 'alert' : 'good';
        case 'avgViewsRaw':
        case 'avgReelsPlaysRaw':
            return statValue <= 0.1 ? 'alert' : 'good';
        case 'followersGrowthRaw':
            return statValue <= 0.02 ? 'alert' : 'good';
        case 'totalPosts':
            return statValue <= 10 ? 'alert' : 'good';
        default:
            return;
    }
};
