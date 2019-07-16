function curve
    hold on ; grid on ;
    for a = [0.01 0.1 0.5 2 4 8 20 1000]
        [x,y] = f(a) ;
        msg = sprintf("-;%d;",a);
        plot(x,y,msg);
        set(gca,'xlim', [0 1]);
        set(gca,'ylim', [0 1]);
    end
    hold off;

end
function [x,y] =f(a)
    x=[0:0.1:1];
    y=(a.^x-1)/(a-1);
end

