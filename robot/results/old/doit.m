function doit
# See scores distribution 
#   from Reward function calls

system("grep Cat ~/Downloads/x.log | awk '{print $9}' > /tmp/junk");
x=load("/tmp/junk");
system("grep Dog ~/Downloads/x.log | awk '{print $9}' > /tmp/junk");
y=load("/tmp/junk");

bar([0:10],[distrib(x); distrib(y)]');
legend(["cat"; "dog"]);
xlabel("Sequence Score");
ylabel("%Iterations");
grid on ;

figure ;
plot(x);
hold on ;
plot(y);
legend(["cat"; "dog"]);
ylabel("Sequence Score");
xlabel("Iteration");

end

function z = distrib(x) 
for k = 0:10
   count(k+1) = 0 ;
   for i = 1:size(x,1)
      if (x(i) == k) 
       count(k+1) = count(k+1) + 1;
      end
   end 
end
z = 100.0 * count./size(x,1) ;

end

