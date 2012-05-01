import java.awt.Dimension;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;


public class Solution {
	
	//Properties
	public long population;
	public long totalplates;
	public long excessplates;
	public ArrayList<Integer> pattern;
	public static JFrame frame = new JFrame();
	private static JTextField textField;
	private static JLabel lblPopulation = new JLabel("Population:");
	public static JLabel lblPattern = new JLabel("Pattern:");
	private static JLabel lblTotalPlates = new JLabel("Total Plates:");
	private static JLabel lblExcessPlates = new JLabel("Excess Plates:");
	private static JButton btnGeneratePattern = new JButton("Generate Pattern");
	
	
	//Default Constructor
	public Solution (){}
	//Copy Constructor
	public Solution (Solution s){
		this.population = s.population;
		this.totalplates = s.totalplates;
		this.excessplates = s.excessplates;
		this.pattern = s.pattern;
	}
	//Normal Constructor
	public Solution (long population, long totalplates, long excessplates, ArrayList<Integer> pattern){
		this.population = population;
		this.totalplates = totalplates;
		this.excessplates = excessplates;
		this.pattern = pattern;
	}
	
	//Methods
	public String toString(){
		
		StringBuffer sb = new StringBuffer();
		sb.append("Population: " + this.population +"\n");
		sb.append("Pattern: " + GetPatternString(this.pattern)+"\n");
		sb.append("Total Plates: " + this.totalplates+"\n");
		sb.append("Excess Plates: " + this.excessplates+"\n");
		
		return sb.toString();
	}
	
public static Solution Calculate( long population){

	int[] nvalues = {10,26,36};
	
	long bestexcess = Long.MAX_VALUE;
	Solution s = new Solution();
	for(int i = nvalues.length-1; i>-1; i--){
		
		ArrayList<Integer> pattern = new ArrayList<Integer>();
		pattern.add(nvalues[i]);
		long product = Product(pattern);
		long excessplates = Math.abs(population-product);

		if(product>=population && excessplates<bestexcess){
			bestexcess=excessplates;
			s = new Solution(population, product, excessplates, pattern);
		}
		
		if(product<population){
			long originalproduct = product;
			for(int j = i; j>-1; j--){
				
				while(product<population){
					
					ArrayList<Integer> copy = new ArrayList<Integer>(pattern);
					copy.add(nvalues[j]);
					product = Product(copy);
					excessplates = Math.abs(population-product);
					if(product>=population && excessplates<bestexcess){
						bestexcess=excessplates;
						s = new Solution(population, product, excessplates, copy);
					}
					if(product<population){
						pattern = copy;
					}
					else{
						product = originalproduct;
						break;
					}
				}//end while loop
			}//end inner for loop
		}
	}//end outer for loop

	return s;
	
}

public static String GetPatternString(ArrayList<Integer> pattern){
	
	StringBuffer sb = new StringBuffer();
	
	int numbers = 0;
	int letters = 0;
	int both = 0;
	
	for(int i=0;i<pattern.size();i++){
		
		int symbol = pattern.get(i);
		if(symbol==10){
			numbers++;
		}else if (symbol==26){
			letters++;
		}else if (symbol == 36){
			both++;
		}
	}
	
	if(numbers>0){
		if(numbers==1){sb.append("1 Number ");}else{sb.append(numbers + " Numbers ");}
		}
	if(letters>0){
		if(letters==1){sb.append("1 Letter ");}else{sb.append(letters + " Letters ");}
		}
	if(both>0){
		if(both==1){sb.append("1 Number or Letter ");}else{sb.append(both + " (Number or Letter)s ");}
		}
	
	return sb.toString();
	
}

//returns the product of all the integers in the given array
public static long Product(ArrayList<Integer> numbers){
	long product = 1;
	for(int i = 0; i<numbers.size();i++){
		product*=numbers.get(i);		
	}
	return product;
}

public static boolean isLong(String string) {
    try {
        Long.valueOf(string);
        return true;
    } catch (NumberFormatException e) {
        return false;
    }
}

public static void main(String[]args){
	frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	
//Command Line UI
//	Scanner sc = new Scanner(System.in);
//	while(true){
//		
//		System.out.println("Please enter a population: ");
//		int pop = sc.nextInt();
//		Calculate(pop);
//
//	}
	frame.setSize(420, 250);
	// Get the size of the screen
	Dimension dim = Toolkit.getDefaultToolkit().getScreenSize();
	 
	// Determine the new location of the window
	int x = (dim.width-300)/2;
	int y = (dim.height-300)/2;
	 
	// Move the window
	frame.setLocation(x, y);
	frame.setVisible(true);
	frame.setTitle("License Plate Pattern Generator");
	
	JPanel main = new JPanel();
	main.setLayout(null);
	
	JLabel label = new JLabel("");
	label.setBounds(7, 7, 0, 0);
	main.add(label);
	JLabel population_1 = new JLabel("Population: ");
	population_1.setToolTipText("Max Value: 2^63");
	population_1.setBounds(27, 24, 74, 14);
	main.add(population_1);
	
	textField = new JTextField();
	textField.setBounds(98, 21, 117, 20);
	main.add(textField);
	textField.setColumns(10);
	
	textField.addKeyListener(new KeyAdapter() {
		@Override
		public void keyPressed(KeyEvent e) {
			int key = e.getKeyCode();
		     if (key == KeyEvent.VK_ENTER) {
		    	 btnGeneratePattern.doClick();
		     }
		}
	});
	btnGeneratePattern.setBounds(225, 20, 150, 23);
	
	btnGeneratePattern.addActionListener(new ActionListener() {
		public void actionPerformed(ActionEvent e) {
			
			if(isLong(textField.getText())){
				Long population = Long.parseLong(textField.getText());
				Solution best = Calculate(population);
				lblPopulation.setText("Population: " + best.population);
				lblPattern.setText("Pattern: " + GetPatternString(best.pattern));
				lblTotalPlates.setText("Total Plates: " + best.totalplates);
				lblExcessPlates.setText("Excess Plates: " + best.excessplates);
				textField.setText("");
				textField.requestFocus();
			}else{
				JOptionPane.showMessageDialog(frame,
					    "Invalid Input: Please enter a whole number that is less than 2^63.");
				textField.setText("");
				textField.requestFocus();
			}
		}
	});
	main.add(btnGeneratePattern);
	int width = frame.getWidth();
	lblPopulation.setBounds(27, 77, width, 14);
	main.add(lblPopulation);
	lblPattern.setBounds(27, 102, width, 14);
	main.add(lblPattern);
	lblTotalPlates.setBounds(27, 127, width, 14);
	main.add(lblTotalPlates);
	
	frame.getContentPane().add(main);
	frame.getContentPane().add(main);
	lblExcessPlates.setBounds(27, 152, width, 14);
	main.add(lblExcessPlates);

	frame.validate();

}
}//end Solution class
