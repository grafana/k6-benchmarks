set datafile separator ','
set terminal pngcairo background rgb 'white' linewidth 4 size 1200,600 enhanced font 'Arial,16'
set bmargin at screen 130.0/600
set rmargin at screen 1080.0/1200
set output sprintf('%s.png', ec2instance)

set title sprintf('k6 %s / EC2 %s / %s', k6version, ec2instance, script) font 'Arial Bold,20'
set key at graph 0.6, 0.3 autotitle columnhead

set border 31 lw 0.5
set style data lines
set style line 100 lt 1 lc rgb "grey" lw 0.5 # linestyle for the grid
set grid ls 100

set xtics 30
set xlabel 'Time (M:S)'
set xdata time
set format x '%M:%S'
set xtics rotate
set y2tics           # enable second axis
set ytics nomirror   # dont show the tics on that side
set y2range [0:]     # start from 0
set y2label "CPU (%)"

plot sprintf('%s.csv', ec2instance) using ($1):2 axis x1y2 lc rgb '#00d8bfd8', \
     '' using ($1):($3 / 1000) title 'RAM (MB)', \
     '' using ($1):4, \
     '' using ($1):5
